"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Cookie,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type CookieItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type SelectedCookie = CookieItem & {
  qty: number;
};

const cookies: CookieItem[] = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    price: 4.99,
    image: "/cookies/menu-board.png",
  },
  {
    id: "peanut",
    name: "Peanut Butter Explosion",
    price: 4.99,
    image: "/cookies/peanut-butter.png",
  },
  {
    id: "double",
    name: "Double Chocolate Lava",
    price: 4.99,
    image: "/cookies/double-chocolate.png",
  },
  {
    id: "dulce",
    name: "Dulce de Leche Dream",
    price: 4.99,
    image: "/cookies/dulce-leche.png",
  },
  {
    id: "marshmallow",
    name: "Marshmallow Chocolate",
    price: 5.49,
    image: "/cookies/marshmallow.png",
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    price: 5.49,
    image: "/cookies/coconut.png",
  },
];

const boxOptions = [
  {
    name: "Caja 4",
    size: 4,
    price: 18,
    desc: "Perfecta para probar o regalar.",
  },
  {
    name: "Caja 6",
    size: 6,
    price: 26,
    desc: "La más recomendada para degustar.",
  },
  {
    name: "Caja 12",
    size: 12,
    price: 49,
    desc: "Ideal para compartir o eventos.",
  },
];

export default function BoxBuilderPage() {
  const [boxSize, setBoxSize] = useState(6);
  const [selected, setSelected] = useState<SelectedCookie[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");

  const selectedCount = useMemo(
    () => selected.reduce((sum, item) => sum + item.qty, 0),
    [selected]
  );

  const spacesLeft = boxSize - selectedCount;

  const boxPrice = boxOptions.find((box) => box.size === boxSize)?.price || 0;
  const extraPremium = selected.reduce((sum, item) => {
    const premiumExtra = item.price > 4.99 ? (item.price - 4.99) * item.qty : 0;
    return sum + premiumExtra;
  }, 0);

  const total = boxPrice + extraPremium;

  const addCookie = (cookie: CookieItem) => {
    if (selectedCount >= boxSize) return;

    setSelected((prev) => {
      const existing = prev.find((item) => item.id === cookie.id);

      if (existing) {
        return prev.map((item) =>
          item.id === cookie.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...cookie, qty: 1 }];
    });
  };

  const removeOne = (id: string) => {
    setSelected((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeAll = (id: string) => {
    setSelected((prev) => prev.filter((item) => item.id !== id));
  };

  const clearBox = () => {
    setSelected([]);
  };

  const message = encodeURIComponent(
    `Hola Ianis Bakery 🍪\n\nQuiero crear una caja personalizada:\n\nCliente: ${
      customerName || "Sin nombre"
    }\nCaja: ${boxSize} cookies\n\nSabores:\n${selected
      .map((item) => `• ${item.qty} x ${item.name}`)
      .join("\n")}\n\nEspacios llenos: ${selectedCount}/${boxSize}\nTotal: $${total.toFixed(
      2
    )}\nNota: ${note || "Sin nota"}`
  );

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-7 text-[#FFF6EF]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-black text-[#F5ACB1]"
          >
            <ArrowLeft size={18} />
            Menú
          </Link>

          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={58}
            height={58}
            className="rounded-full border border-[#FFF6EF]/70 object-contain"
            priority
          />

          <Link
            href="/cart"
            className="rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704]"
          >
            Carrito
          </Link>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <Sparkles size={17} />
              Constructor de cajas
            </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Crea tu caja perfecta.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF6EF]/70">
              Elige el tamaño de la caja, selecciona tus sabores favoritos y
              envía el pedido directo por WhatsApp con el resumen completo.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute -inset-8 rounded-full bg-[#F5ACB1]/20 blur-3xl" />
            <Image
              src="/cookies/menu-board-2.png"
              alt="Caja premium Ianis Bakery"
              width={900}
              height={1200}
              className="relative aspect-[4/5] w-full rounded-[3rem] object-cover shadow-2xl"
              priority
            />
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-6 shadow-2xl shadow-black/30">
              <div className="mb-6 flex items-center gap-3">
                <Cookie className="text-[#F5ACB1]" />
                <h2 className="text-3xl font-black">Elige tu caja</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {boxOptions.map((box) => (
                  <button
                    key={box.size}
                    onClick={() => {
                      setBoxSize(box.size);
                      setSelected([]);
                    }}
                    className={`rounded-3xl border p-5 text-left transition ${
                      boxSize === box.size
                        ? "border-[#F5ACB1] bg-[#F5ACB1] text-[#120704]"
                        : "border-[#F5ACB1]/20 bg-[#120704]/70 text-[#FFF6EF]"
                    }`}
                  >
                    <p className="text-xl font-black">{box.name}</p>
                    <p className="mt-2 text-sm opacity-80">{box.desc}</p>
                    <p className="mt-4 text-3xl font-black">${box.price}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-6 shadow-2xl shadow-black/30">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#D99B55]">
                    Sabores
                  </p>
                  <h2 className="mt-2 text-3xl font-black">
                    Selecciona cookies
                  </h2>
                </div>

                <div className="rounded-full bg-[#F5ACB1] px-5 py-3 font-black text-[#120704]">
                  {selectedCount}/{boxSize} seleccionadas
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cookies.map((cookie) => (
                  <article
                    key={cookie.id}
                    className="overflow-hidden rounded-[2rem] border border-[#F5ACB1]/15 bg-[#FFF6EF] text-[#2A120B]"
                  >
                    <Image
                      src={cookie.image}
                      alt={cookie.name}
                      width={600}
                      height={500}
                      className="aspect-[4/3] w-full object-cover"
                    />

                    <div className="p-5">
                      <h3 className="text-xl font-black">{cookie.name}</h3>
                      <p className="mt-2 text-sm text-[#2A120B]/65">
                        {cookie.price > 4.99
                          ? "+$0.50 sabor premium"
                          : "Incluida en caja"}
                      </p>

                      <button
                        onClick={() => addCookie(cookie)}
                        disabled={selectedCount >= boxSize}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#C95867] px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Plus size={18} />
                        Agregar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[2.5rem] border border-[#F5ACB1]/25 bg-[#210D08]/95 p-6 shadow-2xl shadow-black/40 lg:sticky lg:top-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-[#D99B55]">
                  Vista previa
                </p>
                <h2 className="mt-3 text-4xl font-black">Tu caja</h2>
              </div>

              {spacesLeft === 0 ? (
                <CheckCircle2 className="text-[#F5ACB1]" size={34} />
              ) : (
                <ShoppingBag className="text-[#F5ACB1]" size={34} />
              )}
            </div>

            <div className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#120704]/75 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-black text-[#F5ACB1]">
                  Caja de {boxSize}
                </span>
                <span className="font-black text-[#D99B55]">
                  {spacesLeft} espacio(s)
                </span>
              </div>

              {selected.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#F5ACB1]/25 p-8 text-center text-[#FFF6EF]/55">
                  Agrega cookies para llenar tu caja.
                </div>
              ) : (
                <div className="space-y-3">
                  {selected.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#F5ACB1]/15 bg-[#210D08]/80 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={58}
                          height={58}
                          className="h-14 w-14 rounded-xl object-cover"
                        />

                        <div className="flex-1">
                          <p className="font-black text-[#F5ACB1]">
                            {item.name}
                          </p>
                          <p className="text-sm text-[#FFF6EF]/55">
                            Cantidad: {item.qty}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeOne(item.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#120704] text-[#F5ACB1]"
                          >
                            <Minus size={16} />
                          </button>

                          <button
                            onClick={() => removeAll(item.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F5ACB1]/20 text-[#F5ACB1]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-5 py-4 outline-none placeholder:text-[#FFF6EF]/35"
              />

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nota especial, dedicatoria o instrucciones..."
                className="min-h-28 w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-5 py-4 outline-none placeholder:text-[#FFF6EF]/35"
              />

              <div className="rounded-2xl border border-[#F5ACB1]/15 bg-[#120704]/75 p-5">
                <Row label="Caja base" value={`$${boxPrice.toFixed(2)}`} />
                <Row
                  label="Extras premium"
                  value={`$${extraPremium.toFixed(2)}`}
                />
                <div className="mt-3 border-t border-[#F5ACB1]/15 pt-3">
                  <Row label="Total" value={`$${total.toFixed(2)}`} highlight />
                </div>
              </div>

              <button
                onClick={clearBox}
                className="w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-8 py-4 font-black text-[#FFF6EF]"
              >
                Vaciar caja
              </button>

              <a
                href={`https://wa.me/?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className={`flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-black ${
                  spacesLeft === 0
                    ? "bg-[#F5ACB1] text-[#120704]"
                    : "pointer-events-none bg-[#F5ACB1]/35 text-[#120704]/60"
                }`}
              >
                <ShoppingBag />
                Enviar caja por WhatsApp
              </a>

              {spacesLeft > 0 && (
                <p className="text-center text-sm text-[#FFF6EF]/55">
                  Llena todos los espacios para enviar el pedido.
                </p>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span
        className={
          highlight ? "text-xl font-black text-[#F5ACB1]" : "text-[#FFF6EF]/60"
        }
      >
        {label}
      </span>
      <span
        className={
          highlight ? "text-2xl font-black text-[#F5ACB1]" : "font-black"
        }
      >
        {value}
      </span>
    </div>
  );
}
