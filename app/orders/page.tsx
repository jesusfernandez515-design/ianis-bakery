"use client";

import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  LogIn,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  fallbackImage?: string;
};

type CartItem = Product & {
  qty: number;
};

type DeliveryType = "pickup" | "delivery";

type CreatedOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  note: string;
  delivery: DeliveryType;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

const BUSINESS_WHATSAPP_NUMBER = "17274039118";

const products: Product[] = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    price: 4.99,
    image: "/nutella.png",
    fallbackImage: "/Nutella%20Supreme.png",
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Explosion",
    price: 4.99,
    image: "/peanut-butter.png",
  },
  {
    id: "double-chocolate",
    name: "Double Chocolate Lava",
    price: 4.99,
    image: "/double-chocolate.png",
  },
  {
    id: "dulce-leche",
    name: "Dulce de Leche Dream",
    price: 4.99,
    image: "/dulce-leche.png",
  },
  {
    id: "marshmallow",
    name: "Marshmallow Chocolate",
    price: 5.49,
    image: "/marshmallow.png",
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    price: 5.49,
    image: "/coconut.png",
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [delivery, setDelivery] =
    useState<DeliveryType>("pickup");

  const [coupon, setCoupon] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [items]);

  const normalizedCoupon = coupon.trim().toUpperCase();

  const discount =
    normalizedCoupon === "IANIS10"
      ? subtotal * 0.1
      : 0;

  const deliveryFee =
    delivery === "delivery" ? 3 : 0;

  const total = Math.max(
    subtotal - discount + deliveryFee,
    0
  );

  const totalItems = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.qty,
      0
    );
  }, [items]);

  const addProduct = (product: Product) => {
    setItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          qty: 1,
        },
      ];
    });

    setCreatedOrder(null);
    setErrorMessage("");
  };

  const updateQty = (
    id: string,
    amount: number
  ) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty + amount,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );

    setCreatedOrder(null);
    setErrorMessage("");
  };

  const removeItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );

    setCreatedOrder(null);
    setErrorMessage("");
  };

  const clearCart = () => {
    setItems([]);
    setCreatedOrder(null);
    setErrorMessage("");
  };

  const clearMessages = () => {
    setCreatedOrder(null);
    setErrorMessage("");
  };

  const createOrder = async () => {
    clearMessages();

    const currentUser = auth.currentUser;

    if (!currentUser) {
      setErrorMessage(
        "Debes iniciar sesión antes de confirmar el pedido para que aparezca en Mis pedidos."
      );
      return;
    }

    const cleanCustomerName =
      customerName.trim();

    const cleanCustomerPhone =
      customerPhone.trim();

    const cleanAddress = address.trim();
    const cleanNote = note.trim();

    if (!cleanCustomerName) {
      setErrorMessage(
        "Escribe el nombre del cliente."
      );
      return;
    }

    if (!cleanCustomerPhone) {
      setErrorMessage(
        "Escribe el número de teléfono del cliente."
      );
      return;
    }

    if (
      delivery === "delivery" &&
      !cleanAddress
    ) {
      setErrorMessage(
        "Escribe la dirección completa para el delivery."
      );
      return;
    }

    if (items.length === 0) {
      setErrorMessage(
        "Agrega al menos una cookie al pedido."
      );
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        lineTotal: Number(
          (item.price * item.qty).toFixed(2)
        ),
      }));

      const savedSubtotal = Number(
        subtotal.toFixed(2)
      );

      const savedDiscount = Number(
        discount.toFixed(2)
      );

      const savedDeliveryFee = Number(
        deliveryFee.toFixed(2)
      );

      const savedTotal = Number(
        total.toFixed(2)
      );

      const savedItems = [...items];

      const orderReference = await addDoc(
        collection(db, "orders"),
        {
          customerId: currentUser.uid,
          customerEmail:
            currentUser.email || "",

          customerName: cleanCustomerName,
          customerPhone: cleanCustomerPhone,

          address:
            delivery === "delivery"
              ? cleanAddress
              : "",

          note: cleanNote,
          delivery,
          coupon: normalizedCoupon,
          items: orderItems,
          itemCount: totalItems,

          subtotal: savedSubtotal,
          discount: savedDiscount,
          deliveryFee: savedDeliveryFee,
          total: savedTotal,

          status: "Pendiente",
          paymentStatus: "Pendiente",
          source: "website",

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setCreatedOrder({
        id: orderReference.id,
        customerName: cleanCustomerName,
        customerPhone: cleanCustomerPhone,
        address:
          delivery === "delivery"
            ? cleanAddress
            : "",
        note: cleanNote,
        delivery,
        items: savedItems,
        subtotal: savedSubtotal,
        discount: savedDiscount,
        deliveryFee: savedDeliveryFee,
        total: savedTotal,
      });

      setItems([]);
      setCoupon("");
      setAddress("");
      setNote("");
      setDelivery("pickup");
    } catch (error) {
      console.error(
        "Error creando el pedido:",
        error
      );

      setErrorMessage(
        "No se pudo crear el pedido. Revisa las reglas de Firestore y vuelve a intentarlo."
      );
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = useMemo(() => {
    if (!createdOrder) {
      return "";
    }

    const itemLines = createdOrder.items
      .map(
        (item) =>
          `• ${item.qty} × ${item.name} — $${(
            item.qty * item.price
          ).toFixed(2)}`
      )
      .join("\n");

    return encodeURIComponent(
      [
        "Hola Ianis Bakery 🍪",
        "",
        "Nuevo pedido desde la página web.",
        "",
        `Orden: ${createdOrder.id}`,
        `Cliente: ${createdOrder.customerName}`,
        `Teléfono: ${createdOrder.customerPhone}`,
        "",
        "PRODUCTOS",
        itemLines,
        "",
        `Método: ${
          createdOrder.delivery === "pickup"
            ? "Recogido en tienda"
            : "Delivery"
        }`,
        `Dirección: ${
          createdOrder.delivery === "delivery"
            ? createdOrder.address ||
              "Sin dirección"
            : "No aplica"
        }`,
        "",
        `Subtotal: $${createdOrder.subtotal.toFixed(
          2
        )}`,
        `Descuento: -$${createdOrder.discount.toFixed(
          2
        )}`,
        `Delivery: $${createdOrder.deliveryFee.toFixed(
          2
        )}`,
        `TOTAL: $${createdOrder.total.toFixed(
          2
        )}`,
        "",
        `Nota: ${
          createdOrder.note ||
          "Sin nota especial"
        }`,
      ].join("\n")
    );
  }, [createdOrder]);

  const whatsappUrl = createdOrder
    ? `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${whatsappMessage}`
    : "";

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-7 text-[#FFF6EF]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

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
            className="h-14 w-14 rounded-full border border-[#FFF6EF]/70 object-cover"
            priority
          />

          <Link
            href="/shop"
            className="rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704]"
          >
            Tienda
          </Link>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <ShoppingBag size={17} />
              Checkout premium
            </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Crea un pedido real.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF6EF]/70">
              Selecciona tus sabores, completa
              los datos y guarda el pedido en
              Firebase para verlo desde tu
              cuenta.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <HeaderStat
                value="6"
                label="Sabores"
              />

              <HeaderStat
                value={String(totalItems)}
                label="Cookies"
              />

              <HeaderStat
                value={`$${total.toFixed(2)}`}
                label="Total"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.7rem] border border-[#F5ACB1]/20 bg-[#210D08] p-3 shadow-2xl shadow-black/45">
            <SafeProductImage
              src="/cookie-boxes.png"
              fallbackSrc="/logo-ianis.png"
              alt="Cajas de cookies Ianis Bakery"
              width={1200}
              height={800}
              priority
              className="aspect-[3/2] w-full rounded-[2.2rem] object-cover"
            />
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-5 shadow-2xl shadow-black/30 md:p-6">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D99B55]">
                  Catálogo
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Sabores disponibles
                </h2>

                <p className="mt-2 text-sm font-semibold text-[#FFF6EF]/50">
                  Toca “Agregar” para comenzar.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[2rem] border border-[#E6B47C]/25 bg-[#FFF6EF] text-[#2A120B] shadow-xl"
                  >
                    <SafeProductImage
                      src={product.image}
                      fallbackSrc={
                        product.fallbackImage ||
                        "/logo-ianis.png"
                      }
                      alt={product.name}
                      width={700}
                      height={700}
                      className="aspect-square w-full object-cover"
                    />

                    <div className="p-5">
                      <h3 className="min-h-14 text-xl font-black leading-tight">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-2xl font-black text-[#C95867]">
                        ${product.price.toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          addProduct(product)
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#C95867] px-5 py-3 font-black text-white transition hover:bg-[#A84251]"
                      >
                        <Plus size={18} />
                        Agregar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-5 shadow-2xl shadow-black/25 md:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D99B55]">
                    Carrito
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Productos seleccionados
                  </h2>
                </div>

                <span className="rounded-full bg-[#F5ACB1] px-4 py-2 text-sm font-black text-[#120704]">
                  {totalItems}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-[#F5ACB1]/25 bg-[#120704]/50 px-5 py-12 text-center">
                  <ShoppingBag
                    size={44}
                    className="mx-auto text-[#F5ACB1]/60"
                  />

                  <h3 className="mt-4 text-2xl font-black text-[#F5ACB1]">
                    Tu carrito está vacío
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm leading-7 text-[#FFF6EF]/50">
                    Agrega uno o más sabores para
                    preparar tu pedido.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#120704]/55 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <SafeProductImage
                            src={item.image}
                            fallbackSrc={
                              item.fallbackImage ||
                              "/logo-ianis.png"
                            }
                            alt={item.name}
                            width={100}
                            height={100}
                            className="h-24 w-24 shrink-0 rounded-[1.4rem] object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <h3 className="font-black leading-tight text-[#F5ACB1]">
                              {item.name}
                            </h3>

                            <p className="mt-2 text-sm text-[#FFF6EF]/55">
                              {item.qty} × $
                              {item.price.toFixed(2)}
                            </p>

                            <p className="mt-1 font-black text-[#D99B55]">
                              $
                              {(
                                item.price * item.qty
                              ).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(
                                  item.id,
                                  1
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5ACB1] text-[#120704]"
                            >
                              <Plus size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateQty(
                                  item.id,
                                  -1
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#210D08] text-[#F5ACB1]"
                            >
                              <Minus size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(item.id)
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5ACB1]/20 text-[#F5ACB1]"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#F5ACB1]/20 px-5 py-4 font-black text-[#F5ACB1]"
                  >
                    <Trash2 size={18} />
                    Vaciar carrito
                  </button>
                </>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-[2.5rem] border border-[#F5ACB1]/25 bg-[#210D08]/95 p-6 shadow-2xl shadow-black/40 lg:sticky lg:top-24">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#D99B55]">
              Resumen
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Tu pedido
            </h2>

            {createdOrder && (
              <div className="mt-6 rounded-2xl border border-green-500/25 bg-green-500/10 p-5 text-green-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={24}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-black">
                      ¡Tu orden fue recibida
                      exitosamente!
                    </p>

                    <p className="mt-2 break-all text-sm text-green-100/70">
                      Orden: {createdOrder.id}
                    </p>

                    <Link
                      href="/orders"
                      className="mt-4 inline-flex font-black text-green-200 underline"
                    >
                      Ver en Mis pedidos
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm font-semibold leading-6 text-red-100">
                {errorMessage}

                {!auth.currentUser && (
                  <Link
                    href="/account"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#F5ACB1] px-5 py-3 font-black text-[#120704]"
                  >
                    <LogIn size={18} />
                    Iniciar sesión
                  </Link>
                )}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <input
                value={customerName}
                onChange={(event) => {
                  setCustomerName(
                    event.target.value
                  );
                  clearMessages();
                }}
                placeholder="Nombre del cliente"
                className="input"
              />

              <input
                type="tel"
                value={customerPhone}
                onChange={(event) => {
                  setCustomerPhone(
                    event.target.value
                  );
                  clearMessages();
                }}
                placeholder="Número de teléfono"
                className="input"
              />

              {delivery === "delivery" && (
                <textarea
                  value={address}
                  onChange={(event) => {
                    setAddress(
                      event.target.value
                    );
                    clearMessages();
                  }}
                  placeholder="Dirección completa para delivery"
                  className="input min-h-24 resize-none"
                />
              )}

              <textarea
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  clearMessages();
                }}
                placeholder="Nota especial..."
                className="input min-h-28 resize-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDelivery("pickup");
                    setAddress("");
                    clearMessages();
                  }}
                  className={`rounded-2xl px-4 py-4 font-black ${
                    delivery === "pickup"
                      ? "bg-[#F5ACB1] text-[#120704]"
                      : "border border-[#F5ACB1]/20 bg-[#120704]/60"
                  }`}
                >
                  Recogido
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDelivery("delivery");
                    clearMessages();
                  }}
                  className={`rounded-2xl px-4 py-4 font-black ${
                    delivery === "delivery"
                      ? "bg-[#F5ACB1] text-[#120704]"
                      : "border border-[#F5ACB1]/20 bg-[#120704]/60"
                  }`}
                >
                  Delivery
                </button>
              </div>

              <input
                value={coupon}
                onChange={(event) => {
                  setCoupon(event.target.value);
                  clearMessages();
                }}
                placeholder="CUPÓN: IANIS10"
                className="input uppercase"
              />

              <div className="space-y-3 rounded-2xl border border-[#F5ACB1]/15 bg-[#120704]/75 p-5">
                <Row
                  label="Subtotal"
                  value={`$${subtotal.toFixed(2)}`}
                />

                <Row
                  label="Descuento"
                  value={`-$${discount.toFixed(2)}`}
                />

                <Row
                  label="Delivery"
                  value={`$${deliveryFee.toFixed(2)}`}
                />

                <div className="border-t border-[#F5ACB1]/15 pt-3">
                  <Row
                    label="Total"
                    value={`$${total.toFixed(2)}`}
                    highlight
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={createOrder}
                disabled={
                  loading || items.length === 0
                }
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creando pedido...
                  </>
                ) : (
                  <>
                    <PackageCheck />
                    Confirmar pedido
                  </>
                )}
              </button>

              {createdOrder && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 py-5 text-center text-lg font-black text-white"
                >
                  <Truck />
                  Enviar a WhatsApp
                </a>
              )}

              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/25 bg-[#120704]/75 px-8 py-5 font-black text-[#FFF6EF]/50"
              >
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
          border: 1px solid
            rgba(245, 172, 177, 0.2);
          background: rgba(18, 7, 4, 0.75);
          padding: 15px 16px;
          color: #fff6ef;
          outline: none;
        }

        .input:focus {
          border-color: rgba(
            245,
            172,
            177,
            0.65
          );
        }

        .input::placeholder {
          color: rgba(255, 246, 239, 0.35);
        }
      `}</style>
    </main>
  );
}

function SafeProductImage({
  src,
  fallbackSrc,
  alt,
  className,
  width,
  height,
  priority = false,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const [currentSource, setCurrentSource] =
    useState(src);

  return (
    <Image
      src={currentSource}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => {
        if (currentSource !== fallbackSrc) {
          setCurrentSource(fallbackSrc);
        }
      }}
    />
  );
}

function HeaderStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#F5ACB1]/15 bg-[#210D08]/70 p-4">
      <p className="truncate text-xl font-black text-[#F5ACB1]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#FFF6EF]/45">
        {label}
      </p>
    </div>
  );
}

function Row({
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
            ? "text-xl font-black text-[#F5ACB1]"
            : "text-[#FFF6EF]/60"
        }
      >
        {label}
      </span>

      <span
        className={
          highlight
            ? "text-2xl font-black text-[#F5ACB1]"
            : "font-black"
        }
      >
        {value}
      </span>
    </div>
  );
          }
