"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Gift,
  Heart,
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
  image: string;
};

const products = [
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

const boxes = [
  { name: "Caja 4 Cookies", qty: 4, price: 18 },
  { name: "Caja 6 Cookies", qty: 6, price: 26 },
  { name: "Caja 12 Cookies", qty: 12, price: 49 },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    { ...products[2], qty: 1 },
    { ...products[3], qty: 1 },
  ]);
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [coupon, setCoupon] = useState("");
  const [selectedBox, setSelectedBox] = useState("Caja 6 Cookies");
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const discount = coupon.trim().toUpperCase() === "IANIS10" ? subtotal * 0.1 : 0;
  const deliveryFee = delivery === "delivery" ? 3 : 0;
  const total = subtotal - discount + deliveryFee;

  const addProduct = (product: (typeof products)[number]) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + amount) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const message = encodeURIComponent(
    `Hola Ianis Bakery 🍪\n\nQuiero hacer un pedido:\n\nCliente: ${
      customerName || "Sin nombre"
    }\nCaja: ${selectedBox}\n\n${items
      .map(
        (item) =>
          `• ${item.qty} x ${item.name} - $${(item.qty * item.price).toFixed(2)}`
      )
      .join("\n")}\n\nEntrega: ${
      delivery === "pickup" ? "Recogido" : "Delivery"
    }\nSubtotal: $${subtotal.toFixed(2)}\nDescuento: $${discount.toFixed(
      2
    )}\nDelivery: $${deliveryFee.toFixed(2)}\nTotal: $${total.toFixed(
      2
    )}\n\nNota: ${note || "Sin nota"}`
  );

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-7 text-[#FFF6EF]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Link href="/menu" className="flex items-center gap-2 font-black text-[#F5ACB1]">
            <ArrowLeft size={18} />
            Menú
          </Link>

          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={56}
            height={56}
            className="rounded-full border border-[#FFF6EF]/70 object-contain"
            priority
          />

          <Link
            href="/taste"
            className="rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704]"
          >
            Opinión
          </Link>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <ShoppingBag size={17} />
              Checkout premium
            </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Crea tu caja dulce perfecta.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF6EF]/70">
              Selecciona sabores, tipo de caja, entrega y envía el pedido directo
              por WhatsApp con el total calculado automáticamente.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute -inset-8 rounded-full bg-[#F5ACB1]/20 blur-3xl" />
            <Image
              src="/cookies/menu-board-2.png"
              alt="Caja Ianis Bakery"
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
                <Gift className="text-[#F5ACB1]" />
                <h2 className="text-3xl font-black">Tipo de caja</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {boxes.map((box) => (
                  <button
                    key={box.name}
                    onClick={() => setSelectedBox(box.name)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      selectedBox === box.name
                        ? "border-[#F5ACB1] bg-[#F5ACB1] text-[#120704]"
                        : "border-[#F5ACB1]/20 bg-[#120704]/70 text-[#FFF6EF]"
                    }`}
                  >
                    <p className="text-xl font-black">{box.name}</p>
                    <p className="mt-2 text-sm opacity-80">{box.qty} unidades</p>
                    <p className="mt-4 text-3xl font-black">${box.price}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-6 shadow-2xl shadow-black/30">
              <div className="mb-6 flex items-center gap-3">
                <CookieIcon />
                <h2 className="text-3xl font-black">Sabores disponibles</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[2rem] border border-[#F5ACB1]/15 bg-[#FFF6EF] text-[#2A120B]"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={600}
                      height={500}
                      className="aspect-[4/3] w-full object-cover"
                    />

                    <div className="p-5">
                      <h3 className="text-xl font-black">{product.name}</h3>
                      <p className="mt-2 text-2xl font-black text-[#C95867]">
                        ${product.price.toFixed(2)}
                      </p>

                      <button
                        onClick={() => addProduct(product)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#C95867] px-5 py-3 font-black text-white"
                      >
                        <Plus size={18} />
                        Agregar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#210D08]/90 p-5 shadow-2xl shadow-black/25"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-[1.5rem] object-cover"
                      />

                      <div>
                        <h3 className="text-2xl font-black text-[#F5ACB1]">
                          {item.name}
                        </h3>
                        <p className="text-[#FFF6EF]/60">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#120704] text-[#F5ACB1]"
                      >
                        <Minus />
                      </button>

                      <span className="text-xl font-black">{item.qty}</span>

                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5ACB1] text-[#120704]"
                      >
                        <Plus />
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F5ACB1]/20 text-[#F5ACB1]"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>

          <aside className="h-fit rounded-[2.5rem] border border-[#F5ACB1]/25 bg-[#210D08]/95 p-6 shadow-2xl shadow-black/40 lg:sticky lg:top-6">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#D99B55]">
              Resumen
            </p>
            <h2 className="mt-3 text-4xl font-black">Tu pedido</h2>

            <div className="mt-6 space-y-4">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-5 py-4 outline-none placeholder:text-[#FFF6EF]/35"
              />

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nota especial, mensaje o instrucciones..."
                className="min-h-28 w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-5 py-4 outline-none placeholder:text-[#FFF6EF]/35"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDelivery("pickup")}
                  className={`rounded-2xl px-5 py-4 font-black ${
                    delivery === "pickup"
                      ? "bg-[#F5ACB1] text-[#120704]"
                      : "border border-[#F5ACB1]/20"
                  }`}
                >
                  Recogido
                </button>

                <button
                  onClick={() => setDelivery("delivery")}
                  className={`rounded-2xl px-5 py-4 font-black ${
                    delivery === "delivery"
                      ? "bg-[#F5ACB1] text-[#120704]"
                      : "border border-[#F5ACB1]/20"
                  }`}
                >
                  Delivery
                </button>
              </div>

              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Cupón: IANIS10"
                className="w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-5 py-4 outline-none placeholder:text-[#FFF6EF]/35"
              />

              <div className="space-y-3 rounded-2xl border border-[#F5ACB1]/15 bg-[#120704]/75 p-5">
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row label="Descuento" value={`-$${discount.toFixed(2)}`} />
                <Row label="Delivery" value={`$${deliveryFee.toFixed(2)}`} />
                <div className="border-t border-[#F5ACB1]/15 pt-3">
                  <Row label="Total" value={`$${total.toFixed(2)}`} highlight />
                </div>
              </div>

              <a
                href={`https://wa.me/?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704]"
              >
                <Truck />
                Enviar por WhatsApp
              </a>

              <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/25 bg-[#120704]/75 px-8 py-5 font-black text-[#FFF6EF]">
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
      <span className={highlight ? "text-xl font-black text-[#F5ACB1]" : "text-[#FFF6EF]/60"}>
        {label}
      </span>
      <span className={highlight ? "text-2xl font-black text-[#F5ACB1]" : "font-black"}>
        {value}
      </span>
    </div>
  );
}

function CookieIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
      🍪
    </div>
  );
      }
