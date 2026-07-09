"use client";

import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  CheckCircle2,
  Cookie,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { db } from "@/lib/firebase";

const flavors = [
  "Nutella Supreme",
  "Double Chocolate Lava",
  "Dulce de Leche Dream",
  "Peanut Butter Explosion",
  "Marshmallow Chocolate",
  "Coconut Paradise",
  "Otro",
];

const prices = [
  "Menos de $2.00",
  "$2.00 - $2.99",
  "$3.00 - $3.99",
  "$4.00 - $4.99",
  "$5.00 o más",
];

export default function TasteSurveyPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.flavor || !form.taste || !form.texture || !form.wouldBuy) {
      alert("Por favor contesta el sabor, sabor, textura y si la comprarías.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "ianisFeedback"), {
        ...form,
        taste: Number(form.taste || 0),
        texture: Number(form.texture || 0),
        appearance: Number(form.appearance || 0),
        aroma: Number(form.aroma || 0),
        size: Number(form.size || 0),
        value: Number(form.value || 0),
        brand: "Ianis Bakery",
        createdAt: serverTimestamp(),
      });

      setSent(true);
    } catch (error) {
      console.error(error);
      alert("Hubo un error guardando tu respuesta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-[#0B0706] px-5 py-10 text-[#FFF3EE]">
        <div className="mx-auto flex min-h-[85vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/90 p-8 text-center shadow-2xl shadow-black/50">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={120}
              height={120}
              className="mx-auto rounded-full border border-[#E8A39A]/30 object-cover"
              priority
            />

            <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2B6AD] text-[#0B0706]">
              <CheckCircle2 size={44} />
            </div>

            <p className="mt-6 text-sm uppercase tracking-[0.35em] text-[#D8A85B]">
              Ianis Bakery
            </p>

            <h1 className="mt-4 text-4xl font-black">¡Gracias!</h1>

            <p className="mt-4 text-[#FFF3EE]/75">
              Tu opinión fue recibida. Gracias por ayudarnos a mejorar nuestras
              cookies gourmet y crear sabores que la gente quiera volver a
              comprar.
            </p>

            <div className="mt-6 rounded-3xl border border-[#E8A39A]/20 bg-[#0B0706]/70 p-5">
              <p className="font-bold text-[#F2B6AD]">
                Presenta esta pantalla y recibe un detalle especial en tu
                próxima compra.
              </p>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-2xl bg-[#F2B6AD] px-8 py-4 font-black text-[#0B0706]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0706] px-5 py-8 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(232,163,154,0.20),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.16),transparent_35%)]" />

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
            className="mx-auto rounded-full border border-[#E8A39A]/30 object-cover shadow-2xl shadow-[#E8A39A]/20"
            priority
          />

          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[#E8A39A]/25 bg-[#1A0D0B]/80 px-4 py-2 text-sm text-[#F2B6AD]">
            <Sparkles size={16} />
            Cookies gourmet · Rellenas hasta el centro
          </div>

          <h1 className="mt-5 text-4xl font-black md:text-5xl">
            Encuesta de Degustación
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[#FFF3EE]/70">
            Gracias por probar nuestras galletas. Esta encuesta toma menos de
            dos minutos y nos ayuda a mejorar sabor, textura, precio y
            presentación.
          </p>
        </header>

        <form
          onSubmit={submitSurvey}
          className="space-y-6 rounded-[2rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/50 md:p-8"
        >
          <Field label="Tu nombre, opcional">
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ej. María"
              className="input"
            />
          </Field>

          <Field label="¿Qué sabor probaste?">
            <select
              value={form.flavor}
              onChange={(e) => update("flavor", e.target.value)}
              className="input"
              required
            >
              <option value="">Selecciona un sabor</option>
              {flavors.map((flavor) => (
                <option key={flavor} value={flavor}>
                  {flavor}
                </option>
              ))}
            </select>
          </Field>

          <Rating label="Sabor" value={form.taste} onChange={(v) => update("taste", v)} />
          <Rating label="Textura" value={form.texture} onChange={(v) => update("texture", v)} />
          <Rating label="Apariencia / presentación" value={form.appearance} onChange={(v) => update("appearance", v)} />
          <Rating label="Aroma" value={form.aroma} onChange={(v) => update("aroma", v)} />
          <Rating label="Tamaño de la galleta" value={form.size} onChange={(v) => update("size", v)} />
          <Rating label="Relación calidad / precio" value={form.value} onChange={(v) => update("value", v)} />

          <Field label="¿Cuánto pagarías por una galleta?">
            <select
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="input"
            >
              <option value="">Selecciona un precio</option>
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </Field>

          <Field label="¿La comprarías si estuviera disponible hoy?">
            <select
              value={form.wouldBuy}
              onChange={(e) => update("wouldBuy", e.target.value)}
              className="input"
              required
            >
              <option value="">Selecciona una opción</option>
              <option>Sí, definitivamente</option>
              <option>Probablemente sí</option>
              <option>No estoy seguro(a)</option>
              <option>Probablemente no</option>
              <option>Definitivamente no</option>
            </select>
          </Field>

          <Field label="¿Qué fue lo que más te gustó?">
            <textarea
              value={form.favorite}
              onChange={(e) => update("favorite", e.target.value)}
              placeholder="Sabor, textura, relleno, tamaño, presentación..."
              className="input min-h-28"
            />
          </Field>

          <Field label="¿Qué mejorarías?">
            <textarea
              value={form.improve}
              onChange={(e) => update("improve", e.target.value)}
              placeholder="Más suave, menos dulce, más relleno, otro empaque..."
              className="input min-h-28"
            />
          </Field>

          <Field label="¿Qué otro sabor te gustaría probar?">
            <input
              value={form.newFlavor}
              onChange={(e) => update("newFlavor", e.target.value)}
              placeholder="Ej. Oreo, Red Velvet, Pistacho..."
              className="input"
            />
          </Field>

          <Field label="Comentarios adicionales">
            <textarea
              value={form.comments}
              onChange={(e) => update("comments", e.target.value)}
              placeholder="Escribe cualquier opinión adicional..."
              className="input min-h-28"
            />
          </Field>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-8 py-5 text-lg font-black text-[#0B0706] transition hover:bg-[#FFF3EE] disabled:opacity-60"
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
          Ianis Bakery · Cookies gourmet · Instagram @ianis_bakery
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-bold text-[#F2B6AD]">{label}</span>
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
        <p className="font-bold text-[#F2B6AD]">{label}</p>
        {value && (
          <span className="rounded-full bg-[#F2B6AD] px-3 py-1 text-sm font-black text-[#0B0706]">
            {value}/10
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
        {Array.from({ length: 10 }, (_, index) => String(index + 1)).map(
          (number) => (
            <button
              key={number}
              type="button"
              onClick={() => onChange(number)}
              className={`rounded-xl border py-3 font-black transition ${
                value === number
                  ? "border-[#F2B6AD] bg-[#F2B6AD] text-[#0B0706]"
                  : "border-[#E8A39A]/15 bg-[#2A1713] text-[#FFF3EE] hover:bg-[#3A211B]"
              }`}
            >
              {number}
            </button>
          )
        )}
      </div>
    </div>
  );
}
