"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Gift,
  Heart,
  Loader2,
  Lock,
  Mail,
  Package,
  ShoppingBag,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { auth, db } from "@/lib/firebase";

type AccountMode = "login" | "register";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type Notice = {
  type: "success" | "error";
  message: string;
} | null;

export default function AccountPage() {
  const [mode, setMode] = useState<AccountMode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingSession(false);
    });

    return unsubscribe;
  }, []);

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setNotice(null);
  };

  const changeMode = () => {
    setMode((current) =>
      current === "login" ? "register" : "login"
    );

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setNotice(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (processing) return;

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPassword = form.password;

    if (!cleanEmail || !cleanPassword) {
      setNotice({
        type: "error",
        message:
          "Escribe tu correo electrónico y contraseña.",
      });
      return;
    }

    if (mode === "register" && !cleanName) {
      setNotice({
        type: "error",
        message:
          "Escribe tu nombre para crear la cuenta.",
      });
      return;
    }

    if (cleanPassword.length < 6) {
      setNotice({
        type: "error",
        message:
          "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    setProcessing(true);
    setNotice(null);

    try {
      if (mode === "register") {
        const credential =
          await createUserWithEmailAndPassword(
            auth,
            cleanEmail,
            cleanPassword
          );

        await updateProfile(credential.user, {
          displayName: cleanName,
        });

        await setDoc(
          doc(db, "customers", credential.user.uid),
          {
            uid: credential.user.uid,
            name: cleanName,
            email: cleanEmail,
            phone: "",
            points: 0,
            favorites: [],
            role: "customer",
            active: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setNotice({
          type: "success",
          message:
            "Tu cuenta fue creada exitosamente.",
        });
      } else {
        const credential =
          await signInWithEmailAndPassword(
            auth,
            cleanEmail,
            cleanPassword
          );

        const customerReference = doc(
          db,
          "customers",
          credential.user.uid
        );

        const customerSnapshot = await getDoc(
          customerReference
        );

        if (!customerSnapshot.exists()) {
          await setDoc(
            customerReference,
            {
              uid: credential.user.uid,
              name:
                credential.user.displayName || "",
              email:
                credential.user.email ||
                cleanEmail,
              phone: "",
              points: 0,
              favorites: [],
              role: "customer",
              active: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          await setDoc(
            customerReference,
            {
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            },
            { merge: true }
          );
        }

        setNotice({
          type: "success",
          message:
            "Sesión iniciada correctamente.",
        });
      }

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error: unknown) {
      console.error(
        "Firebase authentication error:",
        error
      );

      setNotice({
        type: "error",
        message: getFirebaseErrorMessage(error),
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      setProcessing(true);
      setNotice(null);

      await signOut(auth);

      setNotice({
        type: "success",
        message:
          "Sesión cerrada correctamente.",
      });
    } catch (error) {
      console.error("Logout error:", error);

      setNotice({
        type: "error",
        message:
          "No se pudo cerrar la sesión.",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#120704] px-5 text-[#FFF6EF]">
        <div className="text-center">
          <Loader2
            size={44}
            className="mx-auto animate-spin text-[#F5ACB1]"
          />

          <p className="mt-4 font-black text-[#F5ACB1]">
            Verificando tu cuenta...
          </p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-[#120704] px-5 py-10 text-[#FFF6EF] md:px-10 lg:px-20">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,155,85,0.13),transparent_38%)]" />

        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-black text-[#F5ACB1]"
          >
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>

          <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-7 shadow-2xl shadow-black/40 md:p-10">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={120}
              height={120}
              className="mx-auto h-28 w-28 rounded-full border border-[#FFF6EF]/60 object-cover"
              priority
            />

            <p className="mt-6 text-center text-sm font-black uppercase tracking-[0.35em] text-[#D99B55]">
              Mi cuenta
            </p>

            <h1 className="mt-3 text-center text-4xl font-black md:text-5xl">
              ¡Bienvenido
              {user.displayName
                ? `, ${user.displayName}`
                : ""}
              !
            </h1>

            <p className="mt-3 break-all text-center text-[#FFF6EF]/60">
              {user.email}
            </p>

            {notice && (
              <NoticeBox
                type={notice.type}
                message={notice.message}
              />
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <AccountCard
                href="/orders"
                icon={<Package />}
                title="Mis pedidos"
                description="Consulta tus pedidos, productos, total y estado."
                active
              />

              <AccountCard
                icon={<Heart />}
                title="Favoritos"
                description="Guarda las cookies que más te gustan."
                badge="Próximamente"
              />

              <AccountCard
                icon={<Gift />}
                title="Recompensas"
                description="Comienza a acumular puntos con tus compras."
                badge="Próximamente"
              />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704] transition hover:bg-[#FFF6EF]"
              >
                <ShoppingBag size={20} />
                Ir a la tienda
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={processing}
                className="rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-8 py-5 font-black text-[#FFF6EF] transition hover:border-[#F5ACB1]/45 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing
                  ? "Cerrando sesión..."
                  : "Cerrar sesión"}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-10 text-[#FFF6EF]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,155,85,0.13),transparent_38%)]" />

      <div className="mx-auto flex min-h-[78vh] max-w-md items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/95 p-7 shadow-2xl shadow-black/45"
        >
          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={128}
            height={128}
            className="mx-auto h-28 w-28 rounded-full border border-[#FFF6EF]/60 object-cover"
            priority
          />

          <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-[#F5ACB1]/20 bg-[#120704]/70 px-4 py-3 text-sm font-black text-[#F5ACB1]">
            <Sparkles size={16} />
            Cuenta de cliente
          </div>

          <h1 className="mt-6 text-center text-4xl font-black">
            {mode === "login"
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-[#FFF6EF]/55">
            Accede a pedidos, favoritos y recompensas.
          </p>

          {notice && (
            <NoticeBox
              type={notice.type}
              message={notice.message}
            />
          )}

          <div className="mt-7 space-y-4">
            {mode === "register" && (
              <FormField
                label="Nombre"
                icon={<UserCircle size={21} />}
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  autoComplete="name"
                  required
                  placeholder="Tu nombre"
                  className="w-full bg-transparent text-[#FFF6EF] outline-none placeholder:text-[#FFF6EF]/30"
                />
              </FormField>
            )}

            <FormField
              label="Correo electrónico"
              icon={<Mail size={21} />}
            >
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                autoComplete="email"
                required
                placeholder="cliente@email.com"
                className="w-full bg-transparent text-[#FFF6EF] outline-none placeholder:text-[#FFF6EF]/30"
              />
            </FormField>

            <FormField
              label="Contraseña"
              icon={<Lock size={21} />}
            >
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  updateField(
                    "password",
                    event.target.value
                  )
                }
                autoComplete={
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-transparent text-[#FFF6EF] outline-none placeholder:text-[#FFF6EF]/30"
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] transition hover:bg-[#FFF6EF] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" />
                Procesando...
              </>
            ) : mode === "login" ? (
              "Iniciar sesión"
            ) : (
              "Crear cuenta"
            )}
          </button>

          <button
            type="button"
            onClick={changeMode}
            disabled={processing}
            className="mt-5 w-full text-center font-black text-[#F5ACB1] disabled:opacity-50"
          >
            {mode === "login"
              ? "¿No tienes cuenta? Crear cuenta"
              : "¿Ya tienes cuenta? Iniciar sesión"}
          </button>

          <Link
            href="/"
            className="mt-5 block text-center text-sm font-semibold text-[#FFF6EF]/45"
          >
            Continuar sin iniciar sesión
          </Link>
        </form>
      </div>
    </main>
  );
}

function FormField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-black text-[#F5ACB1]">
        {label}
      </span>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-4 py-4 focus-within:border-[#F5ACB1]/60">
        <span className="shrink-0 text-[#F5ACB1]">
          {icon}
        </span>

        {children}
      </div>
    </label>
  );
}

function NoticeBox({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 ${
        type === "success"
          ? "border-green-500/25 bg-green-500/10 text-green-200"
          : "border-red-400/25 bg-red-400/10 text-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2
          className="mt-0.5 shrink-0"
          size={20}
        />
      ) : (
        <AlertCircle
          className="mt-0.5 shrink-0"
          size={20}
        />
      )}

      <p>{message}</p>
    </div>
  );
}

function AccountCard({
  href,
  icon,
  title,
  description,
  active = false,
  badge,
}: {
  href?: string;
  icon: ReactNode;
  title: string;
  description: string;
  active?: boolean;
  badge?: string;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
          {icon}
        </div>

        {active && (
          <ChevronRight
            size={24}
            className="text-[#F5ACB1]"
          />
        )}

        {badge && (
          <span className="rounded-full border border-[#F5ACB1]/20 bg-[#F5ACB1]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#F5ACB1]">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-2xl font-black text-[#F5ACB1]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#FFF6EF]/60">
        {description}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-[2rem] border border-[#F5ACB1]/18 bg-[#120704]/70 p-6 transition duration-200 hover:-translate-y-1 hover:border-[#F5ACB1]/50 hover:bg-[#190A07]"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="rounded-[2rem] border border-[#F5ACB1]/12 bg-[#120704]/45 p-6 opacity-75">
      {content}
    </article>
  );
}

function getFirebaseErrorMessage(error: unknown) {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : "";

  switch (code) {
    case "auth/operation-not-allowed":
      return "El acceso con correo y contraseña no está activado en Firebase Authentication.";

    case "auth/email-already-in-use":
      return "Ya existe una cuenta registrada con este correo electrónico.";

    case "auth/invalid-email":
      return "El correo electrónico no tiene un formato válido.";

    case "auth/weak-password":
      return "La contraseña es demasiado débil. Usa al menos 6 caracteres.";

    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "El correo electrónico o la contraseña son incorrectos.";

    case "auth/too-many-requests":
      return "Se hicieron demasiados intentos. Espera unos minutos y vuelve a intentarlo.";

    case "auth/network-request-failed":
      return "No se pudo conectar con Firebase. Revisa tu conexión a internet.";

    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado en Firebase Authentication.";

    case "permission-denied":
    case "firestore/permission-denied":
      return "Firebase permitió el acceso, pero Firestore bloqueó el perfil del cliente.";

    default:
      return code
        ? `No se pudo completar la acción. Código: ${code}`
        : "No se pudo completar la acción. Intenta nuevamente.";
  }
        }
