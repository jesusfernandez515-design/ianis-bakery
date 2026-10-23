import PaymentResult from "./payment-result";

export default async function CheckoutReturn({ searchParams }: {
  searchParams: Promise<{ order?: string | string[]; session_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const orderId = typeof params.order === "string" && /^online-[a-f\d]{64}$/.test(params.order) ? params.order : null;
  const sessionId = typeof params.session_id === "string" && /^cs_test_[A-Za-z0-9]{1,200}$/.test(params.session_id) ? params.session_id : null;
  return <PaymentResult orderId={orderId} sessionId={sessionId} />;
}
