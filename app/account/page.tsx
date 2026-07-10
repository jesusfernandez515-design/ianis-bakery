"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  Gift,
  Heart,
  Loader2,
  Lock,
  Mail,
  Package,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        await addDoc(collection(db, "customers"), {
          uid: credential.user.uid,
          name: form.name,
          email: form.email,
          points: 0,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo completar la acción. Revisa el email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <main className="min-h-screen bg-[#120704] px-5 py-8 text-[#FFF6EF]">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-black text-[#F5ACB1]"
          >
            <ArrowLeft size={18} />
            Volver
          </Link>

          <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-8 shadow-2xl">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={120}
              height={120}
              className="mx-auto rounded-full border border-[#FFF6EF]/70 object-contain"
              priority
            />

            <p className="mt-6 text-center text-sm uppercase tracking-[0.35em] text-[#D99B55]">
              Mi cuenta
            </p>

            <h1 className="mt-3 text-center text-4xl font-black">
              Bienvenido a Ianis Bakery
            </h1>

            <p className="mt-3 text-center text-[#FFF6EF]/60">{user.email}</p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Card icon={<Package />} title="Pedidos" text="Historial próximamente" />
              <Card icon={<Heart />} title="Favoritos" text="Tus cookies favoritas" />
              <Card icon={<Gift />} title="Puntos" text="0 puntos acumulados" />
            </div>

            <button
              onClick={logout}
              className="mt-8 w-full rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704]"
            >
              Cerrar sesión
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-8 text-[#FFF6EF]">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <form
          onSubmit={submit}
          className="w-full rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-7 shadow-2xl"
        >
          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={130}
            height={130}
            className="mx-auto rounded-full border border-[#FFF6EF]/70 object-contain"
            priority
          />

          <div className="mx-auto mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#120704]/70 px-4 py-3 text-sm font-black text-[#F5ACB1]">
            <Sparkles size={16} />
            Cuenta de cliente
          </div>

          <h1 className="mt-6 text-center text-4xl font-black">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>

          <p className="mt-3 text-center text-sm text-[#FFF6EF]/55">
            Accede a pedidos, favoritos y recompensas.
          </p>

          <div className="mt-8 space-y-4">
            {mode === "register" && (
              <Field icon={<UserCircle />} label="Nombre">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  placeholder="Tu nombre"
                  className="input"
                />
              </Field>
            )}

            <Field icon={<Mail />} label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                placeholder="cliente@email.com"
                className="input"
              />
            </Field>

            <Field icon={<Lock />} label="Contraseña">
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="input"
              />
            </Field>
          </div>

          <button
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Procesando...
              </>
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Crear cuenta"
            )}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-5 w-full text-center font-bold text-[#F5ACB1]"
          >
            {mode === "login"
              ? "¿No tienes cuenta? Crear cuenta"
              : "¿Ya tienes cuenta? Iniciar sesión"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          background: transparent;
          outline: none;
          color: #fff6ef;
        }

        .input::placeholder {
          color: rgba(255, 246, 239, 0.35);
        }
      `}</style>
    </main>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-bold text-[#F5ACB1]">{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-4 py-4">
        <span className="text-[#F5ACB1]">{icon}</span>
        {children}
      </div>
    </label>
  );
}

function Card({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#120704]/70 p-5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
        {icon}
      </div>
      <h3 className="text-xl font-black text-[#F5ACB1]">{title}</h3>
      <p className="mt-2 text-sm text-[#FFF6EF]/60">{text}</p>
    </div>
  );
}
