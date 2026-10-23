import type Stripe from "stripe";
import { paymentsConfigured, stripeClient } from "@/lib/server/stripe";
import { confirmsPayment, type PaymentAttempt } from "@/lib/payment-confirmation";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!paymentsConfigured()) return new Response("Unavailable", { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch { return new Response("Invalid signature", { status: 400 }); }
  if (event.livemode) return new Response("Wrong environment", { status: 400 });
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) return new Response("Ignored");
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") return new Response("Awaiting payment");
  const attemptId = session.metadata?.attemptId;
  if (!attemptId || !/^[a-f\d]{64}$/.test(attemptId)) return new Response("Unrelated session");
  try {
    const [{ adminServices }, { FieldValue }] = await Promise.all([
      import("@/lib/server/firebase-admin"), import("firebase-admin/firestore"),
    ]);
    const { db } = adminServices();
    const attemptRef = db.collection("checkoutAttempts").doc(attemptId);
    await db.runTransaction(async transaction => {
      const attempt = await transaction.get(attemptRef);
      if (!attempt.exists || !confirmsPayment(session, attempt.data() as PaymentAttempt)) throw new Error("Payment mismatch");
      if (attempt.get("paid")) return;
      const orderRef = db.collection("orders").doc(attempt.get("orderId"));
      const order = await transaction.get(orderRef);
      if (!order.exists || order.get("customerId") !== attempt.get("customerId")) throw new Error("Order mismatch");
      transaction.update(attemptRef, { paid: true, eventId: event.id, paidAt: FieldValue.serverTimestamp() });
      // Test payments must never count as real revenue or start food preparation.
      transaction.update(orderRef, { paymentStatus: "Prueba pagada", stripeSessionId: session.id, updatedAt: FieldValue.serverTimestamp() });
    });
    return new Response("Received");
  } catch {
    // A non-2xx response lets Stripe retry after temporary database/session races.
    return new Response("Payment confirmation pending", { status: 500 });
  }
}
