import Link from "next/link";

export default function CheckoutReturn() {
  // A redirect is not evidence of payment. Only the verified webhook updates it.
  return <main className="min-h-screen bg-[#120704] px-6 py-24 text-[#FFF6EF]"><div className="mx-auto max-w-xl space-y-6">
    <h1 className="text-4xl font-black">Verifica el estado de tu pedido</h1>
    <p>Estamos esperando la confirmación del proveedor de pagos. Volver a esta página no confirma un cobro.</p>
    <p>Los pagos de prueba no cobran dinero ni representan pedidos para preparar.</p>
    <Link href="/orders" className="inline-block rounded-xl bg-[#F5ACB1] p-4 font-bold text-[#120704]">Ver mis pedidos</Link>
  </div></main>;
}
