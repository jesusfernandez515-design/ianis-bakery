"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Cookie,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type CookieProduct = {
  id: string;
  name: string;
  shortName: string;
  image: string;
  premiumExtra: number;
};

type SelectedCookie = CookieProduct & {
  quantity: number;
};

type BoxOption = {
  size: number;
  name: string;
  price: number;
  description: string;
};

const cookies: CookieProduct[] = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    shortName: "Nutella",
    image: "/nutella.png",
    premiumExtra: 0,
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Explosion",
    shortName: "Peanut Butter",
    image: "/peanut-butter.png",
    premiumExtra: 0,
  },
  {
    id: "double-chocolate",
    name: "Double Chocolate Lava",
    shortName: "Doble Chocolate",
    image: "/double-chocolate.png",
    premiumExtra: 0,
  },
  {
    id: "dulce-leche",
    name: "Dulce de Leche Dream",
    shortName: "Dulce de Leche",
    image: "/dulce-leche.png",
    premiumExtra: 0,
  },
  {
    id: "marshmallow",
    name: "Marshmallow Chocolate",
    shortName: "Marshmallow",
    image: "/marshmallow.png",
    premiumExtra: 0.5,
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    shortName: "Coco",
    image: "/coconut.png",
    premiumExtra: 0.5,
  },
];

const boxOptions: BoxOption[] = [
  {
    size: 4,
    name: "Caja 4",
    price: 18,
    description: "Perfecta para probar o regalar.",
  },
  {
    size: 6,
    name: "Caja 6",
    price: 26,
    description: "La más recomendada para degustar.",
  },
  {
    size: 12,
    name: "Caja 12",
    price: 42,
    description: "Ideal para compartir o eventos.",
  },
];

export default function BoxBuilderPage() {
  const [boxSize, setBoxSize] = useState(4);
  const [selectedCookies, setSelectedCookies] = useState<SelectedCookie[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");

  const selectedBox = useMemo(
    () =>
      boxOptions.find((option) => option.size === boxSize) ?? boxOptions[0],
    [boxSize]
  );

  const selectedCount = useMemo(
    () =>
      selectedCookies.reduce(
        (total, selectedCookie) => total + selectedCookie.quantity,
        0
      ),
    [selectedCookies]
  );

  const spacesLeft = Math.max(boxSize - selectedCount, 0);

  const premiumExtras = useMemo(
    () =>
      selectedCookies.reduce(
        (total, selectedCookie) =>
          total +
          selectedCookie.premiumExtra * selectedCookie.quantity,
        0
      ),
    [selectedCookies]
  );

  const total = selectedBox.price + premiumExtras;
  const boxComplete = selectedCount === boxSize;

  const getCookieQuantity = (cookieId: string) => {
    return (
      selectedCookies.find((selectedCookie) => selectedCookie.id === cookieId)
        ?.quantity ?? 0
    );
  };

  const selectBox = (size: number) => {
    if (size === boxSize) return;

    setBoxSize(size);
    setSelectedCookies([]);
  };

  const addCookie = (cookie: CookieProduct) => {
    if (selectedCount >= boxSize) return;

    setSelectedCookies((current) => {
      const existingCookie = current.find(
        (selectedCookie) => selectedCookie.id === cookie.id
      );

      if (existingCookie) {
        return current.map((selectedCookie) =>
          selectedCookie.id === cookie.id
            ? {
                ...selectedCookie,
                quantity: selectedCookie.quantity + 1,
              }
            : selectedCookie
        );
      }

      return [
        ...current,
        {
          ...cookie,
          quantity: 1,
        },
      ];
    });
  };

  const removeOneCookie = (cookieId: string) => {
    setSelectedCookies((current) =>
      current
        .map((selectedCookie) =>
          selectedCookie.id === cookieId
            ? {
                ...selectedCookie,
                quantity: selectedCookie.quantity - 1,
              }
            : selectedCookie
        )
        .filter((selectedCookie) => selectedCookie.quantity > 0)
    );
  };

  const removeCookieCompletely = (cookieId: string) => {
    setSelectedCookies((current) =>
      current.filter((selectedCookie) => selectedCookie.id !== cookieId)
    );
  };

  const clearBox = () => {
    setSelectedCookies([]);
  };

  const whatsappMessage = encodeURIComponent(
    [
      "Hola Ianis Bakery 🍪",
      "",
      "Quiero ordenar una caja personalizada:",
      "",
      `Cliente: ${customerName || "Sin nombre"}`,
      `Teléfono: ${customerPhone || "Sin teléfono"}`,
      `Caja: ${selectedBox.name}`,
      "",
      "Sabores:",
      ...selectedCookies.map(
        (selectedCookie) =>
          `• ${selectedCookie.quantity} × ${selectedCookie.name}`
      ),
      "",
      `Cookies seleccionadas: ${selectedCount}/${boxSize}`,
      `Caja base: $${selectedBox.price.toFixed(2)}`,
      `Extras premium: $${premiumExtras.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      "",
      `Nota: ${note || "Sin nota especial"}`,
    ].join("\n")
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#120704] text-[#FFF6EF]">
      <section className="relative px-5 pb-14 pt-10 md:px-10 md:pb-20 md:pt-16 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,155,85,0.17),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_560px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/75 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <Sparkles size={17} />
              Constructor de cajas
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl">
              Crea tu caja perfecta.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF6EF]/68 md:text-xl">
              Elige el tamaño, combina tus sabores favoritos y envía el pedido
              completo directamente por WhatsApp.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <MiniStat value="4" label="Caja pequeña" />
              <MiniStat value="6" label="Degustación" />
              <MiniStat value="12" label="Para compartir" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-8 rounded-full bg-[#F5ACB1]/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08] p-3 shadow-2xl shadow-black/50">
              <Image
                src="/cookie-boxes.png"
                alt="Cajas de 4, 6 y 12 cookies de Ianis Bakery"
                width={1536}
                height={1024}
                className="aspect-[3/2] w-full rounded-[2rem] object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <section className="rounded-[2.3rem] border border-[#F5ACB1]/20 bg-[#210D08]/88 p-5 shadow-2xl shadow-black/25 md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
                  <Package size={24} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D99B55]">
                    Paso uno
                  </p>

                  <h2 className="mt-1 text-3xl font-black">Elige tu caja</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {boxOptions.map((box) => {
                  const active = boxSize === box.size;

                  return (
                    <button
                      key={box.size}
                      type="button"
                      onClick={() => selectBox(box.size)}
                      className={`rounded-[1.7rem] border p-5 text-left transition ${
                        active
                          ? "border-[#F5ACB1] bg-[#F5ACB1] text-[#120704] shadow-xl shadow-[#F5ACB1]/15"
                          : "border-[#F5ACB1]/18 bg-[#120704]/65 text-[#FFF6EF] hover:border-[#F5ACB1]/45"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xl font-black">{box.name}</p>
                        {active && <CheckCircle2 size={22} />}
                      </div>

                      <p
                        className={`mt-3 min-h-12 text-sm leading-6 ${
                          active
                            ? "text-[#120704]/70"
                            : "text-[#FFF6EF]/55"
                        }`}
                      >
                        {box.description}
                      </p>

                      <p className="mt-4 text-3xl font-black">${box.price}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2.3rem] border border-[#F5ACB1]/20 bg-[#210D08]/88 p-5 shadow-2xl shadow-black/25 md:p-7">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D99B55]">
                    Paso dos
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Selecciona los sabores
                  </h2>
                </div>

                <div
                  className={`rounded-full px-5 py-3 text-sm font-black ${
                    boxComplete
                      ? "bg-[#F5ACB1] text-[#120704]"
                      : "border border-[#F5ACB1]/20 bg-[#120704]/70 text-[#F5ACB1]"
                  }`}
                >
                  {selectedCount}/{boxSize} cookies
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {cookies.map((cookie) => {
                  const quantity = getCookieQuantity(cookie.id);
                  const boxIsFull = selectedCount >= boxSize;
                  const selected = quantity > 0;

                  return (
                    <article
                      key={cookie.id}
                      className={`overflow-hidden rounded-[2rem] border bg-[#FFF6EF] text-[#2A120B] shadow-xl transition ${
                        selected
                          ? "border-[#C95867] ring-4 ring-[#C95867]/15"
                          : "border-[#E6B47C]/25"
                      }`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#EEDAC8]">
                        <Image
                          src={cookie.image}
                          alt={cookie.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover"
                        />

                        {selected && (
                          <div className="absolute right-4 top-4 flex h-12 min-w-12 items-center justify-center rounded-full border-4 border-white bg-[#C95867] px-3 text-xl font-black text-white shadow-xl">
                            {quantity}
                          </div>
                        )}

                        {selected && (
                          <div className="absolute bottom-4 left-4 rounded-full bg-[#120704]/90 px-4 py-2 text-sm font-black text-[#F5ACB1] shadow-xl backdrop-blur">
                            {quantity === 1
                              ? "1 seleccionada"
                              : `${quantity} seleccionadas`}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="min-h-14 text-lg font-black uppercase leading-tight">
                          {cookie.name}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#2A120B]/55">
                          {cookie.premiumExtra > 0
                            ? `+$${cookie.premiumExtra.toFixed(
                                2
                              )} por cookie`
                            : "Incluida en el precio de la caja"}
                        </p>

                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() => addCookie(cookie)}
                            disabled={boxIsFull}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#C95867] px-5 py-3 font-black text-white transition hover:bg-[#A74250] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={18} />
                            Agregar
                          </button>
                        ) : (
                          <div className="mt-5 grid grid-cols-[48px_1fr_48px] items-center gap-3">
                            <button
                              type="button"
                              onClick={() => removeOneCookie(cookie.id)}
                              aria-label={`Quitar una ${cookie.name}`}
                              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C95867]/25 bg-white text-[#C95867] transition active:scale-95"
                            >
                              <Minus size={20} />
                            </button>

                            <div className="flex h-12 items-center justify-center rounded-full bg-[#F8DDE0] text-lg font-black text-[#C95867]">
                              {quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() => addCookie(cookie)}
                              disabled={boxIsFull}
                              aria-label={`Agregar otra ${cookie.name}`}
                              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C95867] text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        )}

                        {selected && (
                          <button
                            type="button"
                            onClick={() => removeCookieCompletely(cookie.id)}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#C95867]/20 px-4 py-3 text-sm font-black text-[#C95867]"
                          >
                            <Trash2 size={16} />
                            Quitar este sabor
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[2.3rem] border border-[#F5ACB1]/22 bg-[#210D08]/95 p-5 shadow-2xl shadow-black/40 md:p-6 lg:sticky lg:top-28">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D99B55]">
                  Resumen
                </p>

                <h2 className="mt-2 text-4xl font-black">Tu caja</h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  boxComplete
                    ? "bg-[#F5ACB1] text-[#120704]"
                    : "border border-[#F5ACB1]/20 text-[#F5ACB1]"
                }`}
              >
                {boxComplete ? (
                  <CheckCircle2 size={25} />
                ) : (
                  <ShoppingBag size={24} />
                )}
              </div>
            </div>

            <div className="mt-6 rounded-[1.7rem] border border-[#F5ACB1]/15 bg-[#120704]/70 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-black text-[#F5ACB1]">
                  {selectedBox.name}
                </p>

                <p className="text-sm font-black text-[#D99B55]">
                  {spacesLeft === 0
                    ? "Caja completa"
                    : `${spacesLeft} espacio${spacesLeft === 1 ? "" : "s"}`}
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#FFF6EF]/10">
                <div
                  className="h-full rounded-full bg-[#F5ACB1] transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (selectedCount / boxSize) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#210D08] p-3 text-center">
                  <p className="text-2xl font-black text-[#F5ACB1]">
                    {selectedCount}
                  </p>
                  <p className="mt-1 text-xs text-[#FFF6EF]/45">
                    Seleccionadas
                  </p>
                </div>

                <div className="rounded-2xl bg-[#210D08] p-3 text-center">
                  <p className="text-2xl font-black text-[#D99B55]">
                    {spacesLeft}
                  </p>
                  <p className="mt-1 text-xs text-[#FFF6EF]/45">
                    Restantes
                  </p>
                </div>
              </div>

              {selectedCookies.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[#F5ACB1]/20 px-4 py-8 text-center">
                  <Cookie
                    size={36}
                    className="mx-auto text-[#F5ACB1]/60"
                  />

                  <p className="mt-3 text-sm leading-6 text-[#FFF6EF]/50">
                    Selecciona tus sabores para comenzar a llenar la caja.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {selectedCookies.map((selectedCookie) => (
                    <div
                      key={selectedCookie.id}
                      className="flex items-center gap-3 rounded-2xl border border-[#F5ACB1]/12 bg-[#210D08]/85 p-3"
                    >
                      <div className="relative">
                        <Image
                          src={selectedCookie.image}
                          alt={selectedCookie.name}
                          width={58}
                          height={58}
                          className="h-14 w-14 rounded-xl object-cover"
                        />

                        <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F5ACB1] px-2 text-xs font-black text-[#120704]">
                          {selectedCookie.quantity}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-[#F5ACB1]">
                          {selectedCookie.shortName}
                        </p>

                        <p className="mt-1 text-xs text-[#FFF6EF]/45">
                          Cantidad: {selectedCookie.quantity}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            removeOneCookie(selectedCookie.id)
                          }
                          aria-label={`Quitar una ${selectedCookie.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#120704] text-[#F5ACB1]"
                        >
                          <Minus size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => addCookie(selectedCookie)}
                          disabled={boxComplete}
                          aria-label={`Agregar otra ${selectedCookie.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5ACB1] text-[#120704] disabled:opacity-35"
                        >
                          <Plus size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeCookieCompletely(selectedCookie.id)
                          }
                          aria-label={`Eliminar ${selectedCookie.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F5ACB1]/20 text-[#F5ACB1]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Nombre del cliente"
                className="w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-5 py-4 text-[#FFF6EF] outline-none placeholder:text-[#FFF6EF]/30 focus:border-[#F5ACB1]/60"
              />

              <input
                type="tel"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="Número de teléfono"
                className="w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-5 py-4 text-[#FFF6EF] outline-none placeholder:text-[#FFF6EF]/30 focus:border-[#F5ACB1]/60"
              />

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Nota, dedicatoria o instrucciones especiales..."
                className="min-h-24 w-full resize-none rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-5 py-4 text-[#FFF6EF] outline-none placeholder:text-[#FFF6EF]/30 focus:border-[#F5ACB1]/60"
              />

              <div className="space-y-3 rounded-2xl border border-[#F5ACB1]/15 bg-[#120704]/70 p-5">
                <PriceRow
                  label="Caja base"
                  value={`$${selectedBox.price.toFixed(2)}`}
                />

                <PriceRow
                  label="Extras premium"
                  value={`$${premiumExtras.toFixed(2)}`}
                />

                <div className="border-t border-[#F5ACB1]/12 pt-3">
                  <PriceRow
                    label="Total"
                    value={`$${total.toFixed(2)}`}
                    highlight
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={clearBox}
                disabled={selectedCount === 0}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-6 py-4 font-black text-[#FFF6EF] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <RotateCcw size={18} />
                Vaciar caja
              </button>

              <a
                href={
                  boxComplete
                    ? `https://wa.me/17274039118?text=${whatsappMessage}`
                    : undefined
                }
                target="_blank"
                rel="noreferrer"
                aria-disabled={!boxComplete}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-5 text-center text-lg font-black transition ${
                  boxComplete
                    ? "bg-[#25D366] text-white shadow-xl shadow-[#25D366]/15"
                    : "pointer-events-none bg-[#F5ACB1]/30 text-[#120704]/50"
                }`}
              >
                <ShoppingBag size={21} />
                Enviar pedido por WhatsApp
              </a>

              {!boxComplete && (
                <p className="text-center text-xs leading-5 text-[#FFF6EF]/45">
                  Selecciona las {spacesLeft} cookie
                  {spacesLeft === 1 ? "" : "s"} restante
                  {spacesLeft === 1 ? "" : "s"} para completar la caja.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function MiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#F5ACB1]/15 bg-[#210D08]/70 p-4">
      <p className="text-xl font-black text-[#F5ACB1]">{value}</p>
      <p className="mt-1 text-[11px] leading-4 text-[#FFF6EF]/45">
        {label}
      </p>
    </div>
  );
}

function PriceRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          highlight
            ? "text-lg font-black text-[#F5ACB1]"
            : "text-sm text-[#FFF6EF]/55"
        }
      >
        {label}
      </span>

      <span
        className={
          highlight
            ? "text-2xl font-black text-[#F5ACB1]"
            : "font-black text-[#FFF6EF]"
        }
      >
        {value}
      </span>
    </div>
  );
      }
