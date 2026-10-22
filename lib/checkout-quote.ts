import type { CatalogProduct } from "./catalog";

export type CheckoutItem = {
  id: string; qty: number;
  box?: { size: number; selections: { id: string; qty: number }[] };
};
export class CheckoutError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
const boxPrices: Record<number, number> = { 4: 1800, 6: 2600, 12: 4200 };
const premiumIds = new Set(["marshmallow", "coconut"]);
const boxIds = new Set(["nutella", "peanut-butter", "double-chocolate", "dulce-leche", ...premiumIds]);
function quantity(value: unknown, max = 100): asserts value is number {
  if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > max) throw new CheckoutError("Cantidad inválida.");
}
function text(value: unknown, max: number, required = false) {
  if (typeof value !== "string" || value.trim().length > max || (required && !value.trim())) throw new CheckoutError("Revisa los datos del pedido.");
  return value.trim();
}
export function quoteCheckout(input: unknown, catalog: CatalogProduct[]) {
  if (!input || typeof input !== "object") throw new CheckoutError("Pedido inválido.");
  const body = input as Record<string, unknown>;
  const customerName = text(body.customerName, 120, true);
  const customerPhone = text(body.customerPhone, 30, true);
  if (!/^\+?[\d\s().-]+$/.test(customerPhone) || customerPhone.replace(/\D/g, "").length < 10) throw new CheckoutError("Revisa el teléfono.");
  const delivery = body.delivery;
  if (delivery !== "pickup" && delivery !== "delivery") throw new CheckoutError("Selecciona recogido o delivery.");
  const address = delivery === "delivery" ? text(body.address, 500, true) : "";
  const note = text(body.note, 1000);
  const coupon = text(body.coupon, 30).toUpperCase();
  if (coupon && coupon !== "IANIS10") throw new CheckoutError("Cupón no válido.");
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) throw new CheckoutError("Revisa los productos del carrito.");
  const items = body.items.map((raw: CheckoutItem) => {
    if (!raw || typeof raw.id !== "string" || !/^[\w-]{1,100}$/.test(raw.id)) throw new CheckoutError("Producto inválido.");
    quantity(raw.qty);
    if (raw.id.startsWith("box-")) {
      const box = raw.box;
      if (!box || !Object.hasOwn(boxPrices, box.size) || !Array.isArray(box.selections) || !box.selections.length || box.selections.length > 6) throw new CheckoutError("Vuelve a crear la caja para verificar sus sabores.");
      const seen = new Set<string>();
      let count = 0, extras = 0;
      const names = box.selections.map(selection => {
        if (!selection || !boxIds.has(selection.id) || seen.has(selection.id)) throw new CheckoutError("Sabores de caja inválidos.");
        const product = catalog.find(p => p.id === selection.id && p.active !== false);
        if (!product) throw new CheckoutError("Un sabor de la caja ya no está disponible.");
        quantity(selection.qty, box.size);
        seen.add(selection.id); count += selection.qty;
        extras += premiumIds.has(selection.id) ? selection.qty * 50 : 0;
        return `${selection.qty} ${product.name}`;
      });
      if (count !== box.size) throw new CheckoutError("Completa todos los espacios de la caja.");
      const cents = boxPrices[box.size] + extras;
      return { id: raw.id, qty: raw.qty, name: `Caja ${box.size}: ${names.join(", ")}`, price: cents / 100, lineTotal: cents * raw.qty / 100, cookieCount: box.size, image: "/cookie-boxes.png", box };
    }
    const product = catalog.find(p => p.id === raw.id && p.active !== false);
    if (!product || !Number.isFinite(product.price) || product.price <= 0) throw new CheckoutError("Un producto ya no está disponible.");
    const cents = Math.round(product.price * 100);
    return { id: product.id, qty: raw.qty, name: product.name, price: cents / 100, lineTotal: cents * raw.qty / 100, cookieCount: 1, image: product.image || "/logo-ianis.png" };
  });
  const subtotalCents = items.reduce((sum, item) => sum + Math.round(item.lineTotal * 100), 0);
  const discountCents = coupon === "IANIS10" ? Math.round(subtotalCents / 10) : 0;
  const deliveryCents = delivery === "delivery" ? 300 : 0;
  const totalCents = subtotalCents - discountCents + deliveryCents;
  if (!Number.isSafeInteger(totalCents) || totalCents < 50 || totalCents > 100000) throw new CheckoutError("El pedido supera el límite de pago online ($1,000).");
  if (!Number.isInteger(body.expectedTotalCents) || body.expectedTotalCents !== totalCents) throw new CheckoutError("El precio cambió. Revisa el catálogo y el total antes de pagar.", 409);
  return { customerName, customerPhone, delivery, address, note, coupon, items, itemCount: items.reduce((n, i) => n + i.qty * i.cookieCount, 0), subtotal: subtotalCents / 100, discount: discountCents / 100, deliveryFee: deliveryCents / 100, total: totalCents / 100, totalCents };
}
