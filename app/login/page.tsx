"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { isAdministrator } from "@/lib/admin-access";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!(await isAdministrator(credential.user))) {
        alert("Esta cuenta no tiene permisos de administrador.");
        return;
      }
      router.replace("/admin");
    } catch {
      alert("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0C0C0C] px-5 py-8 text-[#F1E2DC]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(217,132,120,0.24),transparent_35%),radial-gradient(circle_at_bottom,rgba(216,168,91,0.14),transparent_38%)]" />

      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">
        <form
          onSubmit={login}
          className="w-full rounded-[2.5rem] border border-[#D98478]/20 bg-[#171313]/90 p-7 shadow-2xl shadow-black/50"
        >
          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={130}
            height={130}
            className="mx-auto rounded-full border border-[#F1E2DC]/70 object-contain shadow-[0_0_40px_rgba(217,132,120,0.35)]"
            priority
          />

          <p className="mt-6 text-center text-sm uppercase tracking-[0.35em] text-[#B88B61]">
            Admin Access
          </p>

          <h1 className="mt-3 text-center text-4xl font-black">
            Ianis Bakery
          </h1>

          <p className="mt-3 text-center text-sm text-[#F1E2DC]/55">
            Acceso privado para administrar encuestas, productos y pedidos.
          </p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="font-bold text-[#D98478]">Email</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#D98478]/15 bg-[#0C0C0C]/70 px-4 py-4">
                <Mail className="text-[#D98478]" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full bg-transparent outline-none placeholder:text-[#F1E2DC]/35"
                />
              </div>
            </label>

            <label className="block">
              <span className="font-bold text-[#D98478]">Contraseña</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#D98478]/15 bg-[#0C0C0C]/70 px-4 py-4">
                <Lock className="text-[#D98478]" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-transparent outline-none placeholder:text-[#F1E2DC]/35"
                />
              </div>
            </label>
          </div>

          <button
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D98478] px-8 py-5 text-lg font-black text-[#0C0C0C] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar al panel"
            )}
          </button>
          <Link href="/forgot-password" className="mt-5 block text-center text-sm font-bold text-[#D98478]">¿Olvidaste tu contraseña?</Link>
          <Link href="/account" className="mt-4 block text-center text-sm text-[#F1E2DC]/65">Acceso para clientes</Link>
        </form>
      </div>
    </main>
  );
}
