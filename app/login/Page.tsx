"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      alert("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050202] px-5 py-8 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(242,182,173,0.24),transparent_35%),radial-gradient(circle_at_bottom,rgba(216,168,91,0.14),transparent_38%)]" />

      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">
        <form
          onSubmit={login}
          className="w-full rounded-[2.5rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/90 p-7 shadow-2xl shadow-black/50"
        >
          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={130}
            height={130}
            className="mx-auto rounded-full border border-[#FFF3EE]/70 object-contain shadow-[0_0_40px_rgba(242,182,173,0.35)]"
            priority
          />

          <p className="mt-6 text-center text-sm uppercase tracking-[0.35em] text-[#D8A85B]">
            Admin Access
          </p>

          <h1 className="mt-3 text-center text-4xl font-black">
            Ianis Bakery
          </h1>

          <p className="mt-3 text-center text-sm text-[#FFF3EE]/55">
            Acceso privado para administrar encuestas, productos y pedidos.
          </p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="font-bold text-[#F2B6AD]">Email</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 px-4 py-4">
                <Mail className="text-[#F2B6AD]" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full bg-transparent outline-none placeholder:text-[#FFF3EE]/35"
                />
              </div>
            </label>

            <label className="block">
              <span className="font-bold text-[#F2B6AD]">Contraseña</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 px-4 py-4">
                <Lock className="text-[#F2B6AD]" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-transparent outline-none placeholder:text-[#FFF3EE]/35"
                />
              </div>
            </label>
          </div>

          <button
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-8 py-5 text-lg font-black text-[#050202] disabled:opacity-60"
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
        </form>
      </div>
    </main>
  );
}
