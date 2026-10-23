export type PaymentSession = {
  id: string; livemode: boolean; payment_status: string; currency: string | null;
  amount_total: number | null; client_reference_id: string | null;
  metadata: Record<string, string> | null;
};
export type PaymentState = "pending" | "paid" | "failed" | "expired";
export type PaymentAttempt = { sessionId: string; orderId: string; totalCents: number; currency: string; mode: string; paid: boolean; state?: PaymentState };
export function matchesPaymentAttempt(session: PaymentSession, attempt: PaymentAttempt) {
  return !session.livemode && attempt.mode === "test" &&
    session.id === attempt.sessionId && session.client_reference_id === attempt.orderId &&
    session.metadata?.orderId === attempt.orderId && session.currency === attempt.currency &&
    session.amount_total === attempt.totalCents;
}
export function confirmsPayment(session: PaymentSession, attempt: PaymentAttempt) {
  return session.payment_status === "paid" && matchesPaymentAttempt(session, attempt);
}
export const paymentEvents = ["checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed", "checkout.session.expired"];
export function paymentTransition(eventType: string, session: PaymentSession, attempt: PaymentAttempt): PaymentState | null {
  if (!paymentEvents.includes(eventType)) return null;
  if (!matchesPaymentAttempt(session, attempt)) throw new Error("Payment mismatch");
  if (attempt.paid || attempt.state === "paid") return null;
  if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(eventType)) {
    return session.payment_status === "paid" ? "paid" : null;
  }
  // A delayed success can upgrade a failed attempt; late failures never undo paid.
  if (session.payment_status === "paid" || attempt.state === "failed" || attempt.state === "expired") return null;
  return eventType === "checkout.session.expired" ? "expired" : "failed";
}
export function testPaymentLabel(state: PaymentState) {
  return { pending: "Prueba pendiente", paid: "Prueba pagada", failed: "Prueba fallida", expired: "Prueba vencida" }[state];
}
