"use client";

import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  CreditCard,
  Gift,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { db } from "@/lib/firebase";

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

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    { ...products[2], qty: 1 },
    { ...products[3], qty: 1 },
  ]);
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [coupon, setCoupon] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const discount =
    coupon.trim().toUpperCase() === "IANIS10" ? subtotal * 0.1 : 0;

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

  const createOrder = async () => {
    if (!customerName || !customerPhone) {
      alert("Escribe el nombre y teléfono del cliente.");
      return;
    }

    if (delivery === "delivery" && !address) {
      alert("Escribe la dirección para delivery.");
      return;
    }

    if (items.length === 0) {
      alert("Agrega al menos una cookie.");
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        customerName,
        customerPhone,
        address,
        note,
        delivery,
        coupon,
        items,
        subtotal,
        discount,
        deliveryFee,
        total,
        status: "Pendiente",
        paymentStatus: "Pendiente",
        source: "website",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setOrderId(docRef.id);
      alert("Pedido creado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error creando el pedido.");
    } finally {
      setLoading(false);
    }
  };

  const message = encodeURIComponent(
    `Hola Ianis Bakery 🍪\n\nPedido creado desde la web:\n\nCliente: ${customerName}\nTeléfono: ${customerPhone}\n\n${items
      .map(
        (item) =>
          `• ${item.qty} x ${item.name} - $${(item.qty * item.price).toFixed(2)}`
      )
      .join("\n")}\n\nEntrega: ${
      delivery === "pickup" ? "Recogido" : "Delivery"
    }\nDirección: ${address || "N/A"}\nSubtotal: $${subtotal.toFixed(
      2
    )}\nDescuento: $${discount.toFixed(2)}\nDelivery: $${deliveryFee.toFixed(
      2
    )}\nTotal: $${total.toFixed(2)}\n\nNota: ${note || "Sin nota"}\n\nOrder ID: ${
      orderId || "Pendiente"
    }`
  );

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-7 text-[#FFF6EF]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Link
            href="/menu"
            className="flex items-center gap-2 font-black text-[#F5ACB1]"
          >
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
            href="/shop"
            className="rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704]"
          >
            Shop
          </Link>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <ShoppingBag size={17} />
              Checkout premium
            </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Crea un pedido real.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF6EF]/70">
              Este carrito guarda el pedido en Firebase para que aparezca en el
              panel administrativo en tiempo real.
            </p>
          </div>

          <Image
            src="/cookies/menu-board-2.png"
            alt="Caja Ianis Bakery"
            width={900}
            height={1200}
            className="relative aspect-[4/5] w-full rounded-[3rem] object-cover shadow-2xl"
            priority
          />
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-6 shadow-2xl shadow-black/30">
              <h2 className="mb-6 text-3xl font-black">Sabores disponibles</h2>

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
                className="input"
              />

              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Teléfono"
                className="input"
              />

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección si es delivery"
                className="input min-h-24"
              />

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nota especial o instrucciones..."
                className="input min-h-28"
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
                className="input"
              />

              <div className="space-y-3 rounded-2xl border border-[#F5ACB1]/15 bg-[#120704]/75 p-5">
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row label="Descuento" value={`-$${discount.toFixed(2)}`} />
                <Row label="Delivery" value={`$${deliveryFee.toFixed(2)}`} />
                <div className="border-t border-[#F5ACB1]/15 pt-3">
                  <Row label="Total" value={`$${total.toFixed(2)}`} highlight />
                </div>
              </div>

              <button
                onClick={createOrder}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creando pedido...
                  </>
                ) : (
                  <>
                    <ShoppingBag />
                    Crear pedido
                  </>
                )}
              </button>

              {orderId && (
                <a
                  href={`https://wa.me/?text=${message}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 py-5 text-lg font-black text-white"
                >
                  <Truck />
                  Enviar por WhatsApp
                </a>
              )}

              <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/25 bg-[#120704]/75 px-8 py-5 font-black text-[#FFF6EF]">
                <CreditCard />
                Pago online próximamente
              </button>
            </div>
          </aside>
        </section>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(245, 172, 177, 0.2);
          background: rgba(18, 7, 4, 0.75);
          padding: 15px 16px;
          color: #fff6ef;
          outline: none;
        }

        .input::placeholder {
          color: rgba(255, 246, 239, 0.35);
        }
      `}</style>
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
        className={
          highlight
            ? "text-xl font-black text-[#F5ACB1]"
            : "text-[#FFF6EF]/60"
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
