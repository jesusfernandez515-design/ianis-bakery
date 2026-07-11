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
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
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
import { useEffect, useState } from "react";
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

type CustomerProfile = {
  uid?: string;
  name?: string;
  email?: string;
  phone?: string;
  points?: number;
  favorites?: string[];
  role?: string;
  active?: boolean;
};

export default function AccountPage() {
  const [mode, setMode] = useState<AccountMode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);

  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
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

      if (!currentUser) {
        setCustomer(null);
        setLoadingCustomer(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setCustomer(null);
      setLoadingCustomer(false);
      return;
    }

    setLoadingCustomer(true);

    const customerReference = doc(db, "customers", user.uid);

    const unsubscribe = onSnapshot(
      customerReference,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as CustomerProfile;

          setCustomer({
            ...data,
            favorites: Array.isArray(data.favorites)
              ? data.favorites.filter(
                  (favorite): favorite is string =>
                    typeof favorite === "string"
                )
              : [],
            points:
              typeof data.points === "number"
                ? data.points
                : 0,
          });

          setLoadingCustomer(false);
          return;
        }

        try {
          const initialCustomer: CustomerProfile = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
            points: 0,
            favorites: [],
            role: "customer",
            active: true,
          };

          await setDoc(
            customerReference,
            {
              ...initialCustomer,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          setCustomer(initialCustomer);
        } catch (error) {
          console.error(
            "Error creando el perfil del cliente:",
            error
          );

          setNotice({
            type: "error",
            message:
              "No se pudo cargar completamente el perfil del cliente.",
          });
        } finally {
          setLoadingCustomer(false);
        }
      },
      (error) => {
        console.error(
          "Error escuchando el perfil del cliente:",
          error
        );

        setLoadingCustomer(false);

        setNotice({
          type: "error",
          message:
            "No se pudo actualizar la información de tu cuenta.",
        });
      }
    );

    return unsubscribe;
  }, [user]);

  const favoritesCount = customer?.favorites?.length ?? 0;
  const points = customer?.points ?? 0;

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

        const customerSnapshot =
          await getDoc(customerReference);

        if (!customerSnapshot.exists()) {
          await setDoc(
            customerReference,
            {
              uid: credential.user.uid,
              name:
                credential.user.displayName || "",
              email:
                credential.user.email || cleanEmail,
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
        } else {
          const currentData =
            customerSnapshot.data();

          await setDoc(
            customerReference,
            {
              favorites: Array.isArray(
                currentData.favorites
              )
                ? currentData.favorites
                : [],
              points:
                typeof currentData.points === "number"
                  ? currentData.points
                  : 0,
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

      await signOut(auth);

      setCustomer(null);

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
      <main className="flex min-h-[80vh] items-center justify-center bg-[#120704] px-5 text-[#FFF6EF]">
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
    const displayName =
      customer?.name ||
      user.displayName ||
      "";

    return (
      <main className="min-h-screen bg-[#120704] px-5 py-10 text-[#FFF6EF] md:px-10 lg:px-20">
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
              {displayName
                ? `, ${displayName}`
                : ""}
              !
            </h1>

            <p className="mt-3 text-center text-[#FFF6EF]/60">
              {user.email}
            </p>

            {notice && (
              <NoticeBox
                type={notice.type}
                message={notice.message}
              />
            )}

            {loadingCustomer && (
              <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/15 bg-[#120704]/60 px-5 py-4 text-[#F5ACB1]">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                <span className="font-black">
                  Actualizando perfil...
                </span>
              </div>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <AccountCard
                icon={<Package />}
                title="Mis pedidos"
                description="Consulta tus pedidos y su estado."
                href="/orders"
              />

              <AccountCard
                icon={<Heart />}
                title="Favoritos"
                description={
                  favoritesCount === 0
                    ? "Todavía no has guardado cookies favoritas."
                    : favoritesCount === 1
                    ? "Tienes 1 cookie guardada."
                    : `Tienes ${favoritesCount} cookies guardadas.`
                }
                count={favoritesCount}
                href="/shop"
              />

              <AccountCard
                icon={<Gift />}
                title="Recompensas"
                description={
                  points === 1
                    ? "Tienes 1 punto acumulado."
                    : `Tienes ${points} puntos acumulados.`
                }
                count={points}
              />
            </div>

            <div className="mt-8 rounded-[2rem] border border-[#F5ACB1]/15 bg-[#120704]/60 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D99B55]">
                    Resumen de tu cuenta
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Tus beneficios Ianis Bakery
                  </h2>
                </div>

                <div className="flex gap-3">
                  <SummaryBadge
                    label="Favoritos"
                    value={favoritesCount}
                  />

                  <SummaryBadge
                    label="Puntos"
                    value={points}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704]"
              >
                <ShoppingBag size={20} />
                Ir a la tienda
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={processing}
                className="rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-8 py-5 font-black text-[#FFF6EF] disabled:opacity-50"
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
      <div className="mx-auto flex min-h-[78vh] max-w-md items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/92 p-7 shadow-2xl shadow-black/45"
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
                icon={
                  <UserCircle size={21} />
                }
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
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] disabled:cursor-not-allowed disabled:opacity-55"
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
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-black text-[#F5ACB1]">
        {label}
      </span>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/72 px-4 py-4 focus-within:border-[#F5ACB1]/60">
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
  icon,
  title,
  description,
  count,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
  href?: string;
}) {
  const content = (
    <article className="relative h-full rounded-[2rem] border border-[#F5ACB1]/15 bg-[#120704]/70 p-5 transition hover:border-[#F5ACB1]/35 hover:bg-[#180A06]">
      {typeof count === "number" && (
        <div className="absolute right-5 top-5 flex min-h-9 min-w-9 items-center justify-center rounded-full bg-[#F5ACB1] px-3 text-sm font-black text-[#120704] shadow-lg">
          {count}
        </div>
      )}

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
        {icon}
      </div>

      <h3 className="mt-4 pr-12 text-xl font-black text-[#F5ACB1]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#FFF6EF]/60">
        {description}
      </p>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

function SummaryBadge({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-24 rounded-2xl border border-[#F5ACB1]/15 bg-[#210D08] px-4 py-3 text-center">
      <p className="text-2xl font-black text-[#F5ACB1]">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-[#FFF6EF]/50">
        {label}
      </p>
    </div>
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
