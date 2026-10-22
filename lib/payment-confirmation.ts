export type PaymentSession = {
  id: string; livemode: boolean; payment_status: string; currency: string | null;
  amount_total: number | null; client_reference_id: string | null;
  metadata: Record<string, string> | null;
};
export type PaymentAttempt = { sessionId: string; orderId: string; totalCents: number; currency: string; mode: string; paid: boolean };
export function confirmsPayment(session: PaymentSession, attempt: PaymentAttempt) {
  return session.payment_status === "paid" && !session.livemode && attempt.mode === "test" &&
    session.id === attempt.sessionId && session.client_reference_id === attempt.orderId &&
    session.metadata?.orderId === attempt.orderId && session.currency === attempt.currency &&
    session.amount_total === attempt.totalCents;
}
