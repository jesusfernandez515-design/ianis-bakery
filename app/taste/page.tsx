"use client";

import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Cookie, Heart, Loader2, Sparkles, Star } from "lucide-react";
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
      <main className="min-h-screen bg-[#160b07] px-5 py-10 text-white">
        <div className="mx-auto flex min-h-[85vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-[2rem] border border-amber-200/20 bg-white/10 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-300 text-[#160b07]">
              <CheckCircle2 size={52} />
            </div>

            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
              Ianis Bakery
            </p>

            <h1 className="mt-4 text-4xl font-black">¡Gracias!</h1>

            <p className="mt-4 text-amber-100/80">
              Tu opinión fue recibida. Gracias por ayudarnos a mejorar nuestras
              galletas y crear sabores que la gente realmente quiera comprar.
            </p>

            <div className="mt-6 rounded-3xl border border-amber-200/20 bg-amber-300/15 p-5">
              <p className="font-bold text-amber-100">
                Presenta esta pantalla y recibe un detalle especial en tu
                próxima compra.
              </p>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-2xl bg-amber-300 px-8 py-4 font-black text-[#160b07]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#160b07] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-300 text-[#160b07]">
            <Cookie size={42} />
          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
            Ianis Bakery
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Encuesta de Degustación
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-amber-100/75">
            Gracias por probar nuestras galletas. Esta encuesta toma menos de
            dos minutos y nos ayuda a mejorar sabor, textura, precio y
            presentación.
          </p>
        </header>

        <form
          onSubmit={submitSurvey}
          className="space-y-6 rounded-[2rem] border border-amber-200/20 bg-white/[0.08] p-5 shadow-2xl md:p-8"
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

          <Rating
            label="Sabor"
            value={form.taste}
            onChange={(value) => update("taste", value)}
          />

          <Rating
            label="Textura"
            value={form.texture}
            onChange={(value) => update("texture", value)}
          />

          <Rating
            label="Apariencia / presentación"
            value={form.appearance}
            onChange={(value) => update("appearance", value)}
          />

          <Rating
            label="Aroma"
            value={form.aroma}
            onChange={(value) => update("aroma", value)}
          />

          <Rating
            label="Tamaño de la galleta"
            value={form.size}
            onChange={(value) => update("size", value)}
          />

          <Rating
            label="Relación calidad / precio"
            value={form.value}
            onChange={(value) => update("value", value)}
          />

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
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-300 px-8 py-5 text-lg font-black text-[#160b07] transition hover:bg-amber-200 disabled:opacity-60"
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

        <p className="mt-6 text-center text-xs text-amber-100/50">
          Ianis Bakery · Freshly baked with love
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
      <span className="font-bold text-amber-100">{label}</span>
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
        <p className="font-bold text-amber-100">{label}</p>
        {value && (
          <span className="rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-[#160b07]">
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
                  ? "border-amber-300 bg-amber-300 text-[#160b07]"
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
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
