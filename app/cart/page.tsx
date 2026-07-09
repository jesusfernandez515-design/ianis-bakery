"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  tag: string;
  emoji: string;
};

const initialItems: CartItem[] = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    price: 3.5,
    qty: 2,
    tag: "Más pedido",
    emoji: "🍫",
  },
  {
    id: "double-chocolate",
    name: "Double Chocolate Lava",
    price: 3.75,
    qty: 1,
    tag: "Premium",
    emoji: "🍪",
  },
];

const recommended = [
  {
    id: "dulce-leche",
    name: "Dulce de Leche Dream",
    price: 3.5,
    tag: "Favorito",
    emoji: "🍯",
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Explosion",
    price: 3.5,
    tag: "Nuevo",
    emoji: "🥜",
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    price: 3.5,
    tag: "Tropical",
    emoji: "🥥",
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [coupon, setCoupon] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.qty, 0);
  }, [items]);

  const discount = coupon.trim().toLowerCase() === "ianis10" ? subtotal * 0.1 : 0;
  const deliveryFee = fulfillment === "delivery" ? 3 : 0;
  const total = subtotal - discount + deliveryFee;

  const updateQty = (id: string, amount: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: Math.max(1, item.qty + amount),
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addRecommended = (product: (typeof recommended)[number]) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Ianis Bakery, quiero hacer este pedido:\n\n${items
      .map(
        (item) =>
          `- ${item.qty} x ${item.name} ($${item.price.toFixed(2)} c/u)`
      )
      .join("\n")}\n\nMétodo: ${
      fulfillment === "pickup" ? "Recogido" : "Delivery"
    }\nSubtotal: $${subtotal.toFixed(2)}\nDescuento: $${discount.toFixed(
      2
    )}\nDelivery: $${deliveryFee.toFixed(2)}\nTotal: $${total.toFixed(2)}`
  );

  return (
    <main className="min-h-screen bg-[#050202] px-5 py-8 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(242,182,173,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.14),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#E8A39A]/20 bg-[#120706]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-black text-[#F2B6AD]"
          >
            <ArrowLeft size={18} />
            Menú
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={54}
              height={54}
              className="rounded-full border border-[#FFF3EE]/70 object-contain"
              priority
            />
            <span className="hidden font-black text-[#F2B6AD] sm:inline">
              Ianis Bakery
            </span>
          </Link>

          <Link
            href="/taste"
            className="rounded-full bg-[#F2B6AD] px-4 py-3 text-sm font-black text-[#050202]"
          >
            Opinión
          </Link>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8A39A]/25 bg-[#1A0D0B]/80 px-5 py-3 text-sm font-black text-[#F2B6AD]">
              <ShoppingBag size={17} />
              Carrito premium
            </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Tu caja dulce está casi lista.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF3EE]/70">
              Revisa tu selección, aplica un cupón y envía tu pedido directo por
              WhatsApp. Más adelante este carrito puede conectarse con Stripe,
              ATH Móvil e inventario.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[380px]">
            <div className="absolute -inset-8 rounded-full bg-[#F2B6AD]/20 blur-3xl" />
            <div className="relative rounded-[3rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/80 p-5 shadow-2xl shadow-black/50">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={460}
                height={460}
                className="aspect-square w-full rounded-[2.2rem] object-contain bg-[#050202] shadow-[0_0_45px_rgba(242,182,173,0.32)]"
                priority
              />
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            {items.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#E8A39A]/20 bg-[#1A0D0B]/70 p-10 text-center">
                <ShoppingBag className="mx-auto mb-4 text-[#F2B6AD]" size={48} />
                <h2 className="text-3xl font-black">Carrito vacío</h2>
                <p className="mt-2 text-[#FFF3EE]/55">
                  Agrega cookies desde el menú para comenzar.
                </p>
                <Link
                  href="/menu"
                  className="mt-6 inline-flex rounded-2xl bg-[#F2B6AD] px-6 py-4 font-black text-[#050202]"
                >
                  Ver menú
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/25"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#F2B6AD] to-[#D8A85B] text-5xl shadow-xl">
                        {item.emoji}
                      </div>

                      <div>
                        <p className="rounded-full bg-[#2A1713] px-3 py-1 text-xs font-black text-[#D8A85B]">
                          {item.tag}
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-[#F2B6AD]">
                          {item.name}
                        </h2>
                        <p className="mt-1 text-[#FFF3EE]/55">
                          ${item.price.toFixed(2)} cada una
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center gap-2 rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 p-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2A1713] text-[#F2B6AD]"
                        >
                          <Minus size={18} />
                        </button>

                        <span className="w-8 text-center text-lg font-black">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2B6AD] text-[#050202]"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 text-[#F2B6AD]"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}

            <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/25">
              <div className="mb-5 flex items-center gap-2 text-[#F2B6AD]">
                <Sparkles />
                <h2 className="text-2xl font-black">Agregar recomendados</h2>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {recommended.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addRecommended(product)}
                    className="rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 p-4 text-left transition hover:border-[#F2B6AD]/40"
                  >
                    <div className="text-4xl">{product.emoji}</div>
                    <p className="mt-3 font-black text-[#F2B6AD]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm text-[#FFF3EE]/55">
                      ${product.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[2.5rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/95 p-6 shadow-2xl shadow-black/40 lg:sticky lg:top-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#D8A85B]">
                  Resumen
                </p>
                <h2 className="mt-2 text-3xl font-black">Pedido</h2>
              </div>
              <ShoppingBag className="text-[#F2B6AD]" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 p-4">
                <p className="mb-3 font-black text-[#F2B6AD]">
                  Método de entrega
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFulfillment("pickup")}
                    className={`rounded-2xl px-4 py-4 font-black ${
                      fulfillment === "pickup"
                        ? "bg-[#F2B6AD] text-[#050202]"
                        : "border border-[#E8A39A]/15 text-[#FFF3EE]"
                    }`}
                  >
                    Recogido
                  </button>

                  <button
                    onClick={() => setFulfillment("delivery")}
                    className={`rounded-2xl px-4 py-4 font-black ${
                      fulfillment === "delivery"
                        ? "bg-[#F2B6AD] text-[#050202]"
                        : "border border-[#E8A39A]/15 text-[#FFF3EE]"
                    }`}
                  >
                    Delivery
                  </button>
                </div>
              </div>

              <label className="block rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 p-4">
                <span className="flex items-center gap-2 font-black text-[#F2B6AD]">
                  <Gift size={18} />
                  Cupón
                </span>
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Prueba: IANIS10"
                  className="mt-3 w-full rounded-2xl border border-[#E8A39A]/15 bg-[#1A0D0B] px-4 py-4 outline-none placeholder:text-[#FFF3EE]/35"
                />
              </label>

              <div className="space-y-3 rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 p-4">
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row label="Descuento" value={`-$${discount.toFixed(2)}`} />
                <Row label="Delivery" value={`$${deliveryFee.toFixed(2)}`} />

                <div className="border-t border-[#E8A39A]/15 pt-3">
                  <Row
                    label="Total"
                    value={`$${total.toFixed(2)}`}
                    highlight
                  />
                </div>
              </div>

              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-8 py-5 text-lg font-black text-[#050202] transition hover:bg-[#FFF3EE]"
              >
                <Truck />
                Enviar pedido por WhatsApp
              </a>

              <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#E8A39A]/20 bg-[#050202]/70 px-8 py-5 font-black text-[#FFF3EE]">
                <CreditCard />
                Pago online próximamente
              </button>
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
    <div className="flex items-center justify-between">
      <span
        className={highlight ? "text-xl font-black text-[#F2B6AD]" : "text-[#FFF3EE]/60"}
      >
        {label}
      </span>
      <span
        className={highlight ? "text-2xl font-black text-[#F2B6AD]" : "font-black"}
      >
        {value}
      </span>
    </div>
  );
            }
