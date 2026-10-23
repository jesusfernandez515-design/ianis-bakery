"use client";

import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCatalog } from "@/lib/use-catalog";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { CheckoutItem } from "@/lib/checkout-quote";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  fallbackImage?: string;
};

type CartItem = Product & {
  qty: number;
  cookieCount?: number;
  box?: CheckoutItem["box"];
};


const BUSINESS_WHATSAPP_NUMBER = "17274039118";
const CART_STORAGE_KEY = "ianis-bakery-cart";



export default function CartPage() {
  const { products, loading: loadingProducts } = useCatalog();
  const submitting = useRef(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const delivery = "pickup";

  const [coupon, setCoupon] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const address = "";
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [testPaymentsEnabled, setTestPaymentsEnabled] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/checkout", { signal: controller.signal, cache: "no-store" })
      .then(response => response.json())
      .then(result => setTestPaymentsEnabled(result.enabled === true))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
    try {
      const savedCart = window.localStorage.getItem(
        CART_STORAGE_KEY
      );

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          const validItems = parsedCart.filter(
            (item): item is CartItem =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0 &&
              (item.cookieCount === undefined || [4, 6, 12].includes(item.cookieCount)) &&
              Number.isInteger(item.qty) &&
              item.qty > 0 && item.qty <= 100
          );

          setItems(validItems);
        }
      }
    } catch (error) {
      console.error("Error cargando el carrito:", error);
    } finally {
      setCartLoaded(true);
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Error guardando el carrito:", error);
    }
  }, [items, cartLoaded]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ),
    [items]
  );

  const totalItems = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.qty * (item.cookieCount || 1),
        0
      ),
    [items]
  );

  const normalizedCoupon = coupon.trim().toUpperCase();

  const discount = normalizedCoupon === "IANIS10"
    ? Math.round(Math.round(subtotal * 100) / 10) / 100 : 0;

  const deliveryFee = 0;

  const total = Math.max(
    subtotal - discount + deliveryFee,
    0
  );

  const getProductQuantity = (productId: string) => {
    return (
      items.find((item) => item.id === productId)?.qty ?? 0
    );
  };

  const clearOrderConfirmation = () => {
    setOrderId("");
    setErrorMessage("");
  };

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

    clearOrderConfirmation();
  };

  const removeOneProduct = (productId: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );

    clearOrderConfirmation();
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );

    clearOrderConfirmation();
  };

  const clearCart = () => {
    setItems([]);
    clearOrderConfirmation();

    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error vaciando el carrito:", error);
    }
  };

  const createOrder = async () => {
    if (submitting.current || orderId) return;
    clearOrderConfirmation();
    if (!navigator.onLine) {
      setErrorMessage("No tienes conexión. Conéctate antes de confirmar el pedido.");
      return;
    }

    const cleanCustomerName = customerName.trim();
    const cleanCustomerPhone = customerPhone.trim();
    const cleanNote = note.trim();

    if (!cleanCustomerName) {
      setErrorMessage(
        "Escribe el nombre del cliente."
      );
      return;
    }

    if (cleanCustomerPhone.replace(/\D/g, "").length < 10) {
      setErrorMessage(
        "Escribe un teléfono válido con código de área."
      );
      return;
    }

    if (items.length === 0) {
      setErrorMessage(
        "Agrega al menos una cookie al pedido."
      );
      return;
    }

    const checkedItems = items.map(item => {
      if (item.id.startsWith("box-")) return item;
      const product = products.find(product => product.id === item.id);
      return product ? { ...product, qty: item.qty } : null;
    });
    if (loadingProducts || checkedItems.some(item => !item) || checkedItems.some((item, index) => item?.price !== items[index].price)) {
      setItems(checkedItems.filter((item): item is CartItem => item !== null));
      setErrorMessage("Actualizamos tu carrito con el catálogo actual. Revisa el total y confirma nuevamente.");
      return;
    }
    submitting.current = true;
    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        cookieCount: item.cookieCount || 1,
        image: item.image,
        lineTotal: Number(
          (item.price * item.qty).toFixed(2)
        ),
      }));

      const orderReference = await addDoc(
        collection(db, "orders"),
        {
          customerId: user?.uid || "",
          customerEmail: user?.email || "",
          customerName: cleanCustomerName,
          customerPhone: cleanCustomerPhone,
          address: "",
          note: cleanNote,
          delivery,
          coupon: normalizedCoupon,
          items: orderItems,
          itemCount: totalItems,
          subtotal: Number(subtotal.toFixed(2)),
          discount: Number(discount.toFixed(2)),
          deliveryFee: Number(
            deliveryFee.toFixed(2)
          ),
          total: Number(total.toFixed(2)),
          status: "Pendiente",
          paymentStatus: "Pendiente",
          source: "website",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setOrderId(orderReference.id);
    } catch (error) {
      console.error(
        "Error creando el pedido:",
        error
      );

      setErrorMessage(
        "No se pudo crear el pedido. Revisa la conexión con Firebase."
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  const startTestPayment = async () => {
    if (submitting.current || orderId || !testPaymentsEnabled) return;
    setErrorMessage("");
    if (!user) { setErrorMessage("Inicia sesión para probar el pago online."); return; }
    if (!navigator.onLine) { setErrorMessage("Conéctate antes de iniciar el pago."); return; }
    submitting.current = true;
    setLoading(true);
    try {
      const payload = JSON.stringify({ customerName, customerPhone, address, note, delivery, coupon: normalizedCoupon,
        expectedTotalCents: Math.round(total * 100), items: items.map(item => ({ id: item.id, qty: item.qty, ...(item.box ? { box: item.box } : {}) })) });
      // Reuse the same attempt across double clicks, network retries and back navigation.
      const saved = JSON.parse(sessionStorage.getItem("ianis-checkout-attempt") || "null");
      const attempt = saved?.payload === payload && Date.now() - saved.startedAt < 29 * 60 * 1000
        ? saved : { payload, key: crypto.randomUUID(), startedAt: Date.now() };
      sessionStorage.setItem("ianis-checkout-attempt", JSON.stringify(attempt));
      const response = await fetch("/api/checkout", { method: "POST", headers: {
        "Content-Type": "application/json", "Idempotency-Key": attempt.key, "Authorization": `Bearer ${await user.getIdToken()}`,
      }, body: payload });
      const result = await response.json();
      if (result.resetAttempt === true) sessionStorage.removeItem("ianis-checkout-attempt");
      if (!response.ok) throw new Error(result.error || "No se pudo iniciar el pago.");
      const destination = new URL(result.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Enlace de pago no válido.");
      window.location.assign(destination.href);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo iniciar el pago.");
    } finally { submitting.current = false; setLoading(false); }
  };

  const whatsappMessage = useMemo(() => {
    const itemLines = items
      .map(
        (item) =>
          `• ${item.qty} × ${item.name} — $${(
            item.price * item.qty
          ).toFixed(2)}`
      )
      .join("\n");

    return encodeURIComponent(
      [
        "Hola Ianis Bakery 🍪",
        "",
        "Nuevo pedido desde la página web.",
        "",
        `Orden: ${orderId || "Pendiente"}`,
        `Cliente: ${
          customerName.trim() || "Sin nombre"
        }`,
        `Teléfono: ${
          customerPhone.trim() || "Sin teléfono"
        }`,
        "",
        "PRODUCTOS",
        itemLines || "Sin productos",
        "",
        "Método: Recogido en Holiday, Florida",
        "Punto y horario de recogido: coordinar con la panadería.",
        "",
        `Subtotal: $${subtotal.toFixed(2)}`,
        `Descuento: -$${discount.toFixed(2)}`,
        `TOTAL: $${total.toFixed(2)}`,
        "",
        `Nota: ${
          note.trim() || "Sin nota especial"
        }`,
      ].join("\n")
    );
  }, [
    customerName,
    customerPhone,
    discount,
    items,
    note,
    orderId,
    subtotal,
    total,
  ]);

  const whatsappUrl =
    `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}` +
    `?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#0C0C0C] px-5 py-7 text-[#F1E2DC]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(217,132,120,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#D98478]/25 bg-[#171313]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Link
            href="/menu"
            className="flex items-center gap-2 font-black text-[#D98478]"
          >
            <ArrowLeft size={18} />
            Menú
          </Link>

          <Image
            src="/logo-ianis.png"
            alt="Ianis Bakery"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border border-[#F1E2DC]/70 object-cover"
            priority
          />

          <Link
            href="/shop"
            className="rounded-full bg-[#D98478] px-5 py-3 text-sm font-black text-[#0C0C0C]"
          >
            Tienda
          </Link>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D98478]/25 bg-[#171313]/80 px-5 py-3 text-sm font-black text-[#D98478]">
              <ShoppingBag size={17} />
              Checkout premium
            </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Crea un pedido real.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#F1E2DC]/70">
              Selecciona tus sabores, completa tus datos
              y confirma tu pedido. El pago se coordina con la panadería.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <HeaderStat
                value={String(products.length)}
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

          <div className="overflow-hidden rounded-[2.7rem] border border-[#D98478]/20 bg-[#171313] p-3 shadow-2xl shadow-black/45">
            <SafeProductImage
              src="/cookie-boxes.png"
              fallbackSrc="/logo-ianis.png"
              alt="Cajas Ianis Bakery"
              width={1200}
              height={800}
              priority
              className="aspect-[3/2] w-full rounded-[2.2rem] object-cover"
            />
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <section className="rounded-[2.5rem] border border-[#D98478]/20 bg-[#171313]/85 p-5 shadow-2xl shadow-black/30 md:p-6">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#B88B61]">
                  Catálogo
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Sabores disponibles
                </h2>

                <p className="mt-2 text-sm text-[#F1E2DC]/50">
                  Pulsa Agregar y usa los controles para
                  cambiar la cantidad.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const quantity =
                    getProductQuantity(product.id);

                  return (
                    <article
                      key={product.id}
                      className={`overflow-hidden rounded-[2rem] border bg-[#F1E2DC] text-[#291E1B] shadow-xl transition ${
                        quantity > 0
                          ? "border-[#A84355] ring-4 ring-[#A84355]/15"
                          : "border-[#B88B61]/25"
                      }`}
                    >
                      <div className="relative">
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

                        {quantity > 0 && (
                          <span className="absolute right-4 top-4 flex h-12 min-w-12 items-center justify-center rounded-full border-4 border-white bg-[#A84355] px-3 text-xl font-black text-white shadow-xl">
                            {quantity}
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="min-h-14 text-xl font-black leading-tight">
                          {product.name}
                        </h3>

                        <p className="mt-2 text-2xl font-black text-[#A84355]">
                          ${product.price.toFixed(2)}
                        </p>

                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              addProduct(product)
                            }
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#A84355] px-5 py-3 font-black text-white transition active:scale-[0.98]"
                          >
                            <Plus size={18} />
                            Agregar
                          </button>
                        ) : (
                          <>
                            <div className="mt-4 grid grid-cols-[48px_1fr_48px] items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  removeOneProduct(
                                    product.id
                                  )
                                }
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#A84355]/25 text-[#A84355] active:scale-95"
                              >
                                <Minus size={20} />
                              </button>

                              <div className="flex h-12 items-center justify-center rounded-full bg-[#EFD2CB] text-xl font-black text-[#A84355]">
                                {quantity}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  addProduct(product)
                                }
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A84355] text-white active:scale-95"
                              >
                                <Plus size={20} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(product.id)
                              }
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#A84355]/20 px-4 py-3 text-sm font-black text-[#A84355]"
                            >
                              <Trash2 size={16} />
                              Quitar del pedido
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2.5rem] border border-[#D98478]/20 bg-[#171313]/85 p-5 shadow-2xl shadow-black/25 md:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#B88B61]">
                    Carrito
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Productos seleccionados
                  </h2>
                </div>

                <span className="rounded-full bg-[#D98478] px-4 py-2 text-sm font-black text-[#0C0C0C]">
                  {totalItems}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-[#D98478]/25 bg-[#0C0C0C]/50 px-5 py-12 text-center">
                  <ShoppingBag
                    size={44}
                    className="mx-auto text-[#D98478]/60"
                  />

                  <h3 className="mt-4 text-2xl font-black text-[#D98478]">
                    Tu carrito está vacío
                  </h3>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-[2rem] border border-[#D98478]/15 bg-[#0C0C0C]/55 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <SafeProductImage
                            src={item.image}
                            fallbackSrc={
                              item.fallbackImage ||
                              "/logo-ianis.png"
                            }
                            alt={item.name}
                            width={90}
                            height={90}
                            className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <h3 className="font-black text-[#D98478]">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-[#F1E2DC]/50">
                              {item.qty} × $
                              {item.price.toFixed(2)}
                            </p>

                            <p className="mt-1 font-black text-[#B88B61]">
                              $
                              {(
                                item.qty * item.price
                              ).toFixed(2)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D98478]/20 text-[#D98478]"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D98478]/20 px-5 py-4 font-black text-[#D98478]"
                  >
                    <Trash2 size={18} />
                    Vaciar carrito
                  </button>
                </>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-[2.5rem] border border-[#D98478]/25 bg-[#171313]/95 p-6 shadow-2xl shadow-black/40 lg:sticky lg:top-24">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#B88B61]">
              Resumen
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Tu pedido
            </h2>

            {orderId && (
              <div className="mt-6 rounded-2xl border border-green-500/25 bg-green-500/10 p-5 text-green-100">
                <div className="flex gap-3">
                  <CheckCircle2 size={24} />

                  <div>
                    <p className="font-black">
                      ¡Tu orden fue recibida exitosamente!
                    </p>

                    <p className="mt-2 break-all text-xs opacity-70">
                      Orden: {orderId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm font-semibold text-red-100">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <input
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  clearOrderConfirmation();
                }}
                placeholder="Nombre del cliente"
                className="input"
              />

              <input
                type="tel"
                value={customerPhone}
                onChange={(event) => {
                  setCustomerPhone(event.target.value);
                  clearOrderConfirmation();
                }}
                placeholder="Número de teléfono"
                className="input"
              />

              <div className="rounded-2xl border border-[#D98478]/25 bg-[#0C0C0C]/70 p-4">
                <p className="font-black text-[#D98478]">Solo recogido · Holiday, Florida</p>
                <p className="mt-2 text-sm leading-6 text-[#F1E2DC]/70">Consulta el punto y horario de recogido con la panadería. Por el momento no ofrecemos delivery.</p>
              </div>

              <textarea
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  clearOrderConfirmation();
                }}
                placeholder="Nota especial..."
                className="input min-h-24 resize-none"
              />

              <input
                value={coupon}
                onChange={(event) => {
                  setCoupon(event.target.value);
                  clearOrderConfirmation();
                }}
                placeholder="Cupón: IANIS10"
                className="input uppercase"
              />

              <div className="space-y-3 rounded-2xl border border-[#D98478]/15 bg-[#0C0C0C]/75 p-5">
                <Row
                  label="Subtotal"
                  value={`$${subtotal.toFixed(2)}`}
                />

                <Row
                  label="Descuento"
                  value={`-$${discount.toFixed(2)}`}
                />

                <div className="border-t border-[#D98478]/15 pt-3">
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
                disabled={loading || items.length === 0 || Boolean(orderId)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D98478] px-8 py-5 text-lg font-black text-[#0C0C0C] disabled:opacity-45"
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

              {orderId && (
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
                onClick={startTestPayment}
                disabled={!testPaymentsEnabled || loading || items.length === 0 || Boolean(orderId)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#D98478]/25 bg-[#0C0C0C]/75 px-8 py-5 font-black text-[#F1E2DC]/50"
              >
                <CreditCard />
                {testPaymentsEnabled ? "Probar pago — sin cobro real" : "Pago online próximamente"}
              </button>
              {testPaymentsEnabled && <p className="text-sm text-[#F1E2DC]/70">Modo de prueba: no cobra dinero ni envía el pedido a preparación. {user ? "" : "Inicia sesión para continuar."}</p>}
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

        .input:focus {
          border-color: rgba(245, 172, 177, 0.65);
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
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const currentSource = failedSource === src ? fallbackSrc : src;

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
          setFailedSource(src);
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
    <div className="rounded-2xl border border-[#D98478]/15 bg-[#171313]/70 p-4">
      <p className="truncate text-xl font-black text-[#D98478]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#F1E2DC]/45">
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
            ? "text-xl font-black text-[#D98478]"
            : "text-[#F1E2DC]/60"
        }
      >
        {label}
      </span>

      <span
        className={
          highlight
            ? "text-2xl font-black text-[#D98478]"
            : "font-black"
        }
      >
        {value}
      </span>
    </div>
  );
                                  }
