"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import { requestPasswordRecovery, type RecoveryNotice } from "@/lib/password-recovery";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<RecoveryNotice | null>(null);
  const submitting = useRef(false);
  useEffect(() => {
    if (!cooldown) return;
    const timeout = setTimeout(() => setCooldown(current => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  async function recover(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || cooldown) return;
    if (!navigator.onLine) { setNotice({ type: "error", message: "Conéctate a internet antes de solicitar el enlace." }); return; }
    submitting.current = true;
    setLoading(true);
    setNotice(null);
    try {
      const result = await requestPasswordRecovery(auth, email);
      setNotice(result);
      if (result.type === "success") setCooldown(60);
    } finally { submitting.current = false; setLoading(false); }
  }

  return <main className="min-h-screen bg-[#120704] px-5 py-16 text-[#FFF6EF]">
    <div className="mx-auto max-w-md rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08] p-7">
      <Image src="/logo-ianis.png" alt="Ianis Bakery" width={112} height={112} className="mx-auto rounded-full" priority />
      <h1 className="mt-7 text-center text-3xl font-black">Recuperar contraseña</h1>
      <p className="mt-4 text-sm leading-6 text-[#FFF6EF]/70">Escribe el correo de tu cuenta. Te enviaremos un enlace para elegir una nueva contraseña.</p>
      <form onSubmit={recover} className="mt-7 space-y-5">
        <label className="block font-bold" htmlFor="recovery-email">Correo electrónico</label>
        <input id="recovery-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => { setEmail(event.target.value); setNotice(null); }} className="w-full rounded-xl border border-[#F5ACB1]/30 bg-[#120704] p-4 outline-none focus:border-[#F5ACB1]" />
        {notice && <p role={notice.type === "error" ? "alert" : "status"} className={`rounded-xl border p-4 text-sm leading-6 ${notice.type === "error" ? "border-red-300/30 text-red-100" : "border-green-300/30 text-green-100"}`}>{notice.message}</p>}
        <button type="submit" disabled={loading || cooldown > 0} className="w-full rounded-xl bg-[#F5ACB1] p-4 font-black text-[#120704] disabled:opacity-50">{loading ? "Solicitando enlace…" : cooldown > 0 ? `Volver a solicitar en ${cooldown}s` : "Enviar enlace de recuperación"}</button>
      </form>
      <Link href="/account" className="mt-7 block text-center font-bold text-[#F5ACB1]">Volver a mi cuenta</Link>
      <Link href="/login" className="mt-4 block text-center text-sm text-[#FFF6EF]/65">Acceso de administrador</Link>
    </div>
  </main>;
}
