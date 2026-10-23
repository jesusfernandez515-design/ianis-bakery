"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Result = { state: "loading" | "signed-out" | "pending" | "paid" | "failed" | "expired" | "error"; message: string };
const titles: Record<Result["state"], string> = {
  loading: "Verificando el pago de prueba", "signed-out": "Inicia sesión para ver el resultado",
  pending: "Esperando confirmación", paid: "Pago de prueba confirmado",
  failed: "El pago de prueba no se completó", expired: "El intento de pago venció", error: "No pudimos verificar este pedido",
};

export default function PaymentResult({ orderId, sessionId }: { orderId: string | null; sessionId: string | null }) {
  const [result, setResult] = useState<Result>({ state: "loading", message: "Consultando el estado verificado del pedido…" });
  const valid = Boolean(orderId && sessionId);
  useEffect(() => {
    if (!orderId || !sessionId) return;
    let stopOrder: (() => void) | undefined;
    const stopAuth = onAuthStateChanged(auth, user => {
      stopOrder?.();
      if (!user) { setResult({ state: "signed-out", message: "Usa la misma cuenta con la que iniciaste el pago." }); return; }
      setResult({ state: "loading", message: "Consultando el estado verificado del pedido…" });
      stopOrder = onSnapshot(doc(db, "orders", orderId), { includeMetadataChanges: true }, snapshot => {
        const order = snapshot.data();
        if (!order || order.customerId !== user.uid || order.paymentMode !== "test" || (order.stripeSessionId && order.stripeSessionId !== sessionId)) {
          setResult({ state: "error", message: "Revisa el pedido desde tu historial o comunícate con la panadería." }); return;
        }
        if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) {
          setResult({ state: "pending", message: "Esperando conexión con el servidor para verificar el resultado." }); return;
        }
        // Only the signed webhook can write these fields; the URL never changes them.
        const status = order.paymentStatus;
        if (status === "Prueba pagada" && order.stripeSessionId === sessionId) setResult({ state: "paid", message: "Recibimos y verificamos la confirmación de Stripe. No se ha cobrado dinero real." });
        else if (status === "Prueba fallida") setResult({ state: "failed", message: "Puedes volver al carrito e iniciar una nueva prueba." });
        else if (status === "Prueba vencida") setResult({ state: "expired", message: "Vuelve al carrito para iniciar un nuevo intento." });
        else setResult({ state: "pending", message: "El proveedor todavía no ha confirmado el resultado. Esta página se actualizará cuando llegue la confirmación." });
      }, () => setResult({ state: "error", message: "No pudimos consultar el pedido. Revisa tu conexión y tu historial." }));
    });
    return () => { stopOrder?.(); stopAuth(); };
  }, [orderId, sessionId]);

  return <main className="min-h-screen bg-[#0C0C0C] px-6 py-24 text-[#F1E2DC]"><div className="mx-auto max-w-xl space-y-6">
    <p className="text-sm font-bold uppercase tracking-widest text-[#D98478]">Ianis Bakery · Modo de prueba</p>
    <div role="status" aria-live="polite">
      <h1 className="text-4xl font-black">{valid ? titles[result.state] : "Consulta tu historial de pedidos"}</h1>
      <p className="mt-5 leading-7">{valid ? result.message : "Este enlace no contiene un pedido verificable. Puedes revisar su estado en Mis pedidos."}</p>
    </div>
    <p className="rounded-xl border border-[#D98478]/30 p-4">Los pedidos de prueba no se preparan ni representan una compra real.</p>
    <div className="flex flex-wrap gap-4">
      <Link href={result.state === "signed-out" ? "/account" : "/orders"} className="rounded-xl bg-[#D98478] p-4 font-bold text-[#0C0C0C]">{result.state === "signed-out" ? "Iniciar sesión" : "Ver mis pedidos"}</Link>
      <Link href="/cart" className="rounded-xl border border-[#D98478]/40 p-4 font-bold">Volver al carrito</Link>
    </div>
  </div></main>;
}
