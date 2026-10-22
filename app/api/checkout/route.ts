import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { fallbackProducts, type CatalogProduct } from "@/lib/catalog";
import { CheckoutError, quoteCheckout } from "@/lib/checkout-quote";
import { adminServices } from "@/lib/server/firebase-admin";
import { paymentsConfigured, verifiedStripeClient } from "@/lib/server/stripe";

export const runtime = "nodejs";
export function GET() {
  return Response.json({ enabled: paymentsConfigured(), mode: "test" }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  if (!paymentsConfigured()) return Response.json({ error: "El pago online todavía no está disponible." }, { status: 503 });
  try {
    const origin = new URL(request.url).origin;
    if (request.headers.get("origin") !== origin) throw new CheckoutError("Solicitud no permitida.", 403);
    const raw = await request.text();
    if (raw.length > 20000) throw new CheckoutError("Pedido demasiado grande.", 413);
    const key = request.headers.get("idempotency-key");
    if (!key || !/^[a-f\d-]{36}$/.test(key)) throw new CheckoutError("Reintenta el pago desde el carrito.");
    const { db, auth } = adminServices();
    const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new CheckoutError("Inicia sesión para pagar online.", 401);
    const user = await auth.verifyIdToken(token, true).catch(() => { throw new CheckoutError("Tu sesión expiró. Inicia sesión nuevamente.", 401); });
    const body = JSON.parse(raw);
    const products = await db.collection("products").get();
    const catalog = products.empty ? fallbackProducts : products.docs.map(doc => ({ ...doc.data(), id: doc.id } as CatalogProduct));
    const quote = quoteCheckout(body, catalog);
    const fingerprint = createHash("sha256").update(JSON.stringify(quote)).digest("hex");
    const attemptId = createHash("sha256").update(`${user.uid}:${key}`).digest("hex");
    const attemptRef = db.collection("checkoutAttempts").doc(attemptId);
    const orderRef = db.collection("orders").doc(`online-${attemptId}`);
    const limitRef = db.collection("checkoutLimits").doc(user.uid);
    await db.runTransaction(async transaction => {
      const existing = await transaction.get(attemptRef);
      if (existing.exists) {
        if (existing.get("fingerprint") !== fingerprint) throw new CheckoutError("El carrito cambió. Inicia un nuevo pago.", 409);
        if (Date.now() - existing.get("startedAt") > 30 * 60 * 1000) throw new CheckoutError("Este intento expiró. Inicia un nuevo pago.", 409);
        return;
      }
      const limit = await transaction.get(limitRef);
      const windowStart = limit.get("windowStart") || 0;
      const inWindow = Date.now() - windowStart < 10 * 60 * 1000;
      if (inWindow && limit.get("count") >= 5) throw new CheckoutError("Demasiados intentos. Espera unos minutos.", 429);
      transaction.set(limitRef, { windowStart: inWindow ? windowStart : Date.now(), count: inWindow ? limit.get("count") + 1 : 1 });
      transaction.create(attemptRef, { fingerprint, startedAt: Date.now(), orderId: orderRef.id, customerId: user.uid, totalCents: quote.totalCents, currency: "usd", mode: "test", paid: false });
      const { totalCents: _totalCents, ...order } = quote;
      void _totalCents;
      transaction.create(orderRef, { ...order, customerName: `PRUEBA — NO PREPARAR: ${order.customerName}`, customerId: user.uid, customerEmail: user.email || "", status: "Cancelado", paymentStatus: "Prueba pendiente", paymentMode: "test", source: "website-stripe-test", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    });
    const stripe = await verifiedStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      integration_identifier: "ianis-checkout-qpmxntva",
      client_reference_id: orderRef.id,
      metadata: { attemptId, orderId: orderRef.id },
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: quote.totalCents, product_data: { name: "Ianis Bakery — pedido de prueba", description: quote.items.map(i => `${i.qty} × ${i.name}`).join("; ").slice(0, 1000) } } }],
      success_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      expires_at: Math.floor((await attemptRef.get()).get("startedAt") / 1000) + 31 * 60,
    }, { idempotencyKey: `ianis-${attemptId}` });
    if (session.livemode || !session.url) throw new Error("Unexpected checkout session");
    await attemptRef.set({ sessionId: session.id }, { merge: true });
    return Response.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof CheckoutError) return Response.json({ error: error.message }, { status: error.status });
    if (error instanceof SyntaxError) return Response.json({ error: "Pedido inválido." }, { status: 400 });
    // Do not log request bodies, customer data, API keys or Stripe error payloads.
    console.error("Checkout failed", error instanceof Error ? error.name : "UnknownError");
    return Response.json({ error: "No se pudo iniciar el pago. Reintenta; no confirmamos ningún cobro." }, { status: 502 });
  }
}
