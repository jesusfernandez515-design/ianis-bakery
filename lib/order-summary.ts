type OrderSummary = { status?: string; paymentStatus?: string; total?: number; paymentMode?: string; source?: string };
function normalized(value = "") {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
export function isCancelledOrder(order: OrderSummary) {
  return ["cancelado", "cancelada", "cancelled", "canceled", "rechazado", "rechazada", "rejected"].includes(normalized(order.status));
}
export function isTestOrder(order: OrderSummary) {
  return order.paymentMode === "test" || order.source === "website-stripe-test";
}
export function collectedTotal(orders: OrderSummary[]) {
  return orders.reduce((cents, order) => {
    const paid = ["pagado", "pagada", "paid", "completado", "completed"].includes(normalized(order.paymentStatus));
    const amount = Number(order.total || 0);
    return paid && !isTestOrder(order) && !isCancelledOrder(order) && Number.isFinite(amount) && amount > 0
      ? cents + Math.round(amount * 100) : cents;
  }, 0) / 100;
}
