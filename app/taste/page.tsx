"use client";

import Image from "next/image";
import Link from "next/link";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useState,
} from "react";
import { db } from "@/lib/firebase";

const flavors = [
  "Nutella Supreme",
  "Double Chocolate Lava",
  "Dulce de Leche Dream",
  "Peanut Butter Explosion",
  "Marshmallow Chocolate",
  "Coconut Paradise",
  "Otro",
] as const;

const prices = [
  "Menos de $2.00",
  "$2.00 - $2.99",
  "$3.00 - $3.99",
  "$4.00 - $4.99",
  "$5.00 o más",
] as const;

type SurveyForm = {
  name: string;
  flavor: string;
  taste: string;
  texture: string;
  appearance: string;
  aroma: string;
  size: string;
  value: string;
  price: string;
  wouldBuy: string;
  favorite: string;
  improve: string;
  newFlavor: string;
  comments: string;
};

const initialForm: SurveyForm = {
  name: "",
  flavor: "",
  taste: "",
  texture: "",
  appearance: "",
  aroma: "",
  size: "",
  value: "",
  price: "",
  wouldBuy: "",
  favorite: "",
  improve: "",
  newFlavor: "",
  comments: "",
};

export default function TasteSurveyPage() {
  const [form, setForm] = useState<SurveyForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedbackId, setFeedbackId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (
    field: keyof SurveyForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
  };

  const submitSurvey = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    if (!form.flavor) {
      setErrorMessage(
        "Selecciona el sabor que probaste."
      );
      return;
    }

    if (!form.taste) {
      setErrorMessage(
        "Selecciona una puntuación para el sabor."
      );
      return;
    }

    if (!form.texture) {
      setErrorMessage(
        "Selecciona una puntuación para la textura."
      );
      return;
    }

    if (!form.wouldBuy) {
      setErrorMessage(
        "Indica si comprarías la galleta."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const feedbackReference = await addDoc(
        collection(db, "ianisFeedback"),
        {
          name: form.name.trim(),
          flavor: form.flavor,

          taste: Number(form.taste),
          texture: Number(form.texture),
          appearance: Number(form.appearance || 0),
          aroma: Number(form.aroma || 0),
          size: Number(form.size || 0),
          value: Number(form.value || 0),

          price: form.price,
          wouldBuy: form.wouldBuy,
          favorite: form.favorite.trim(),
          improve: form.improve.trim(),
          newFlavor: form.newFlavor.trim(),
          comments: form.comments.trim(),

          brand: "Ianis Bakery",
          source: "website",
          status: "received",
          website: "ianisbakery.com",

          createdAt: serverTimestamp(),
          submittedAt: new Date().toISOString(),
        }
      );

      setFeedbackId(feedbackReference.id);
      setSent(true);
    } catch (error: unknown) {
      console.error(
        "Error enviando la encuesta:",
        error
      );

      setErrorMessage(
        getSurveyErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  const resetSurvey = () => {
    setForm(initialForm);
    setSent(false);
    setFeedbackId("");
    setErrorMessage("");
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-[#0B0706] px-5 py-10 text-[#FFF3EE]">
        <div className="mx-auto flex min-h-[82vh] max-w-lg items-center justify-center">
          <section className="w-full rounded-[2.4rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/95 p-7 text-center shadow-2xl shadow-black/50 md:p-9">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={120}
              height={120}
              className="mx-auto h-28 w-28 rounded-full border border-[#E8A39A]/30 object-cover"
              priority
            />

            <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2B6AD] text-[#0B0706]">
              <CheckCircle2 size={44} />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-[#D8A85B]">
              Ianis Bakery
            </p>

            <h1 className="mt-4 text-4xl font-black">
              ¡Opinión recibida!
            </h1>

            <p className="mt-4 leading-7 text-[#FFF3EE]/70">
              Gracias por ayudarnos a mejorar nuestras
              cookies gourmet.
            </p>

            <div className="mt-6 rounded-3xl border border-[#E8A39A]/20 bg-[#0B0706]/70 p-5">
              <p className="font-bold text-[#F2B6AD]">
                Presenta esta pantalla y recibe un
                detalle especial en tu próxima compra.
              </p>

              {feedbackId && (
                <p className="mt-3 break-all text-xs text-[#FFF3EE]/40">
                  Respuesta: {feedbackId}
                </p>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl bg-[#F2B6AD] px-6 py-4 font-black text-[#0B0706]"
              >
                Volver al inicio
              </Link>

              <button
                type="button"
                onClick={resetSurvey}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E8A39A]/25 bg-[#0B0706]/70 px-6 py-4 font-black text-[#FFF3EE]"
              >
                <RotateCcw size={18} />
                Otra encuesta
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0706] px-5 py-8 text-[#FFF3EE]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(232,163,154,0.20),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.16),transparent_35%)]" />

      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#F2B6AD]"
        >
          <ArrowLeft size={18} />
          Volver
        </Link>

        <header className="mb-8 text-center">
          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={130}
            height={130}
            className="mx-auto h-32 w-32 rounded-full border border-[#E8A39A]/30 object-cover shadow-2xl shadow-[#E8A39A]/20"
            priority
          />

          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[#E8A39A]/25 bg-[#1A0D0B]/80 px-4 py-2 text-sm text-[#F2B6AD]">
            <Sparkles size={16} />
            Cookies gourmet · Rellenas hasta el centro
          </div>

          <h1 className="mt-5 text-4xl font-black md:text-5xl">
            Encuesta de degustación
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#FFF3EE]/70">
            Tu opinión nos ayuda a mejorar el sabor,
            la textura, el precio y la presentación.
          </p>
        </header>

        <form
          onSubmit={submitSurvey}
          className="space-y-6 rounded-[2rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/50 md:p-8"
        >
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-semibold leading-6 text-red-100">
              <AlertCircle
                size={21}
                className="mt-0.5 shrink-0"
              />
              <p>{errorMessage}</p>
            </div>
          )}

          <Field label="Tu nombre, opcional">
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                update("name", event.target.value)
              }
              placeholder="Ej. María"
              autoComplete="name"
              className="input"
            />
          </Field>

          <Field label="¿Qué sabor probaste? *">
            <select
              value={form.flavor}
              onChange={(event) =>
                update("flavor", event.target.value)
              }
              className="input"
              required
            >
              <option value="">
                Selecciona un sabor
              </option>

              {flavors.map((flavor) => (
                <option key={flavor} value={flavor}>
                  {flavor}
                </option>
              ))}
            </select>
          </Field>

          <Rating
            label="Sabor *"
            value={form.taste}
            onChange={(value) =>
              update("taste", value)
            }
          />

          <Rating
            label="Textura *"
            value={form.texture}
            onChange={(value) =>
              update("texture", value)
            }
          />

          <Rating
            label="Apariencia / presentación"
            value={form.appearance}
            onChange={(value) =>
              update("appearance", value)
            }
          />

          <Rating
            label="Aroma"
            value={form.aroma}
            onChange={(value) =>
              update("aroma", value)
            }
          />

          <Rating
            label="Tamaño de la galleta"
            value={form.size}
            onChange={(value) =>
              update("size", value)
            }
          />

          <Rating
            label="Relación calidad / precio"
            value={form.value}
            onChange={(value) =>
              update("value", value)
            }
          />

          <Field label="¿Cuánto pagarías por una galleta?">
            <select
              value={form.price}
              onChange={(event) =>
                update("price", event.target.value)
              }
              className="input"
            >
              <option value="">
                Selecciona un precio
              </option>

              {prices.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </Field>

          <Field label="¿La comprarías si estuviera disponible hoy? *">
            <select
              value={form.wouldBuy}
              onChange={(event) =>
                update("wouldBuy", event.target.value)
              }
              className="input"
              required
            >
              <option value="">
                Selecciona una opción
              </option>
              <option value="Sí, definitivamente">
                Sí, definitivamente
              </option>
              <option value="Probablemente sí">
                Probablemente sí
              </option>
              <option value="No estoy seguro(a)">
                No estoy seguro(a)
              </option>
              <option value="Probablemente no">
                Probablemente no
              </option>
              <option value="Definitivamente no">
                Definitivamente no
              </option>
            </select>
          </Field>

          <Field label="¿Qué fue lo que más te gustó?">
            <textarea
              value={form.favorite}
              onChange={(event) =>
                update("favorite", event.target.value)
              }
              placeholder="Sabor, textura, relleno, tamaño..."
              className="input min-h-28 resize-none"
            />
          </Field>

          <Field label="¿Qué mejorarías?">
            <textarea
              value={form.improve}
              onChange={(event) =>
                update("improve", event.target.value)
              }
              placeholder="Más suave, menos dulce, más relleno..."
              className="input min-h-28 resize-none"
            />
          </Field>

          <Field label="¿Qué otro sabor te gustaría probar?">
            <input
              type="text"
              value={form.newFlavor}
              onChange={(event) =>
                update("newFlavor", event.target.value)
              }
              placeholder="Ej. Oreo, Red Velvet, Pistacho..."
              className="input"
            />
          </Field>

          <Field label="Comentarios adicionales">
            <textarea
              value={form.comments}
              onChange={(event) =>
                update("comments", event.target.value)
              }
              placeholder="Escribe cualquier opinión adicional..."
              className="input min-h-28 resize-none"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-8 py-5 text-lg font-black text-[#0B0706] transition hover:bg-[#FFF3EE] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Heart />
                Enviar mi opinión
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#FFF3EE]/45">
          Ianis Bakery · Cookies gourmet ·
          Instagram @ianis_bakery
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(232, 163, 154, 0.22);
          background: rgba(11, 7, 6, 0.78);
          padding: 15px 16px;
          color: #fff3ee;
          outline: none;
          transition:
            border-color 160ms ease,
            background-color 160ms ease;
        }

        .input:focus {
          border-color: rgba(242, 182, 173, 0.7);
          background: rgba(11, 7, 6, 0.95);
        }

        .input::placeholder {
          color: rgba(255, 243, 238, 0.36);
        }

        select.input option {
          background: #1a0d0b;
          color: #fff3ee;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-bold text-[#F2B6AD]">
        {label}
      </span>

      {children}
    </label>
  );
}

function Rating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold text-[#F2B6AD]">
          {label}
        </p>

        {value && (
          <span className="rounded-full bg-[#F2B6AD] px-3 py-1 text-sm font-black text-[#0B0706]">
            {value}/10
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
        {Array.from(
          { length: 10 },
          (_, index) => String(index + 1)
        ).map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onChange(number)}
            aria-pressed={value === number}
            className={`rounded-xl border py-3 font-black transition ${
              value === number
                ? "border-[#F2B6AD] bg-[#F2B6AD] text-[#0B0706]"
                : "border-[#E8A39A]/15 bg-[#2A1713] text-[#FFF3EE] hover:bg-[#3A211B]"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

function getSurveyErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
      case "firestore/permission-denied":
        return "Firestore está bloqueando la encuesta. Actualiza las reglas de ianisFeedback.";

      case "unavailable":
      case "firestore/unavailable":
        return "Firebase no está disponible temporalmente. Revisa tu conexión e inténtalo nuevamente.";

      case "failed-precondition":
      case "firestore/failed-precondition":
        return "Firestore no está configurado correctamente para guardar esta respuesta.";

      case "unauthenticated":
      case "firestore/unauthenticated":
        return "Firebase exige iniciar sesión para enviar la encuesta. Debemos permitir respuestas públicas en las reglas.";

      default:
        return `No se pudo enviar la encuesta. Código: ${error.code}`;
    }
  }

  return "No se pudo enviar la encuesta. Revisa tu conexión e inténtalo nuevamente.";
          }
