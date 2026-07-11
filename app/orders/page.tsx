"use client";

import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  LogIn,
  Package,
  ReceiptText,
  RefreshCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";

type OrderItem = {
  id?: string;
  name?: string;
  price?: number;
  qty?: number;
  image?: string;
  lineTotal?: number;
};

type Order = {
  id: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  note?: string;
  delivery?: "pickup" | "delivery" | string;
  coupon?: string;
  items?: OrderItem[];
  itemCount?: number;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  total?: number;
  status?: string;
  paymentStatus?: string;
  source?: string;
  createdAt?: Timestamp | Date | string | number | null;
  updatedAt?: Timestamp | Date | string | number | null;
};

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingSession(false);

      if (!currentUser) {
        setOrders([]);
        setLoadingOrders(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setLoadingOrders(true);
    setErrorMessage("");

    const ordersQuery = query(
      collection(db, "orders"),
      where("customerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loadedOrders = snapshot.docs
          .map(mapOrderDocument)
          .sort(
            (firstOrder, secondOrder) =>
              getTimestamp(secondOrder.createdAt) -
              getTimestamp(firstOrder.createdAt)
          );

        setOrders(loadedOrders);
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error cargando pedidos:", error);

        setErrorMessage(
          "No se pudieron cargar tus pedidos. Verifica que los pedidos tengan el campo customerId y que las reglas de Firestore permitan leerlos."
        );

        setOrders([]);
        setLoadingOrders(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const totalPurchased = useMemo(() => {
    return orders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    );
  }, [orders]);

  const totalCookies = useMemo(() => {
    return orders.reduce((total, order) => {
      if (typeof order.itemCount === "number") {
        return total + order.itemCount;
      }

      return (
        total +
        (order.items || []).reduce(
          (itemTotal, item) => itemTotal + Number(item.qty || 0),
          0
        )
      );
    }, 0);
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = normalizeText(order.status);

      return ![
        "completado",
        "completada",
        "completed",
        "cancelado",
        "cancelada",
        "cancelled",
        "rechazado",
        "rechazada",
      ].includes(status);
    }).length;
  }, [orders]);

  if (checkingSession) {
    return (
      <PageShell>
        <LoadingState message="Verificando tu cuenta..." />
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <section className="w-full rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/95 p-7 text-center shadow-2xl shadow-black/40 md:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F5ACB1] text-[#120704]">
              <LogIn size={38} />
            </div>

            <h1 className="mt-6 text-4xl font-black">Inicia sesión</h1>

            <p className="mt-4 leading-7 text-[#FFF6EF]/60">
              Debes iniciar sesión para consultar los pedidos vinculados con tu
              cuenta.
            </p>

            <Link
              href="/account"
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-7 py-5 font-black text-[#120704]"
            >
              <LogIn size={20} />
              Ir a mi cuenta
            </Link>

            <Link
              href="/shop"
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-7 py-5 font-black"
            >
              <ShoppingBag size={20} />
              Ir a la tienda
            </Link>
          </section>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 font-black text-[#F5ACB1]"
          >
            <ArrowLeft size={19} />
            Volver a mi cuenta
          </Link>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-[#F5ACB1] px-5 py-3 font-black text-[#120704]"
          >
            <ShoppingBag size={18} />
            Crear otro pedido
          </Link>
        </div>

        <header className="rounded-[2.7rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-6 shadow-2xl shadow-black/35 md:p-9">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/20 bg-[#120704]/65 px-4 py-2 text-sm font-black text-[#F5ACB1]">
                <ReceiptText size={17} />
                Historial de compras
              </div>

              <h1 className="mt-5 text-4xl font-black md:text-6xl">
                Mis pedidos
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-[#FFF6EF]/60">
                Consulta los productos, el total, el método de entrega y el
                estado de cada pedido.
              </p>

              <p className="mt-3 break-all text-sm text-[#FFF6EF]/40">
                {user.email}
              </p>
            </div>

            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={126}
              height={126}
              className="h-28 w-28 rounded-full border border-[#FFF6EF]/50 object-cover"
              priority
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Pedidos"
              value={String(orders.length)}
              icon={<Package size={22} />}
            />

            <StatCard
              label="Cookies compradas"
              value={String(totalCookies)}
              icon={<ShoppingBag size={22} />}
            />

            <StatCard
              label="Total comprado"
              value={`$${totalPurchased.toFixed(2)}`}
              icon={<ReceiptText size={22} />}
            />
          </div>

          {activeOrders > 0 && (
            <div className="mt-5 rounded-2xl border border-[#D99B55]/20 bg-[#D99B55]/10 px-5 py-4 font-black text-[#F1C581]">
              Tienes {activeOrders} pedido
              {activeOrders === 1 ? "" : "s"} activo
              {activeOrders === 1 ? "" : "s"}.
            </div>
          )}
        </header>

        {errorMessage && (
          <div className="mt-7 flex items-start gap-3 rounded-[2rem] border border-red-400/25 bg-red-400/10 p-5 text-red-100">
            <AlertCircle className="mt-0.5 shrink-0" size={24} />

            <div>
              <p className="font-black">No se pudieron cargar tus pedidos</p>
              <p className="mt-2 text-sm leading-6 text-red-100/75">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {loadingOrders ? (
          <LoadingState message="Cargando tus pedidos..." />
        ) : orders.length === 0 ? (
          <section className="mt-8 rounded-[2.7rem] border border-dashed border-[#F5ACB1]/25 bg-[#210D08]/60 px-6 py-16 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F5ACB1]/10 text-[#F5ACB1]">
              <Package size={48} />
            </div>

            <h2 className="mt-6 text-4xl font-black">
              No tienes pedidos vinculados
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-[#FFF6EF]/55">
              Los pedidos nuevos aparecerán aquí cuando los confirmes mientras
              tienes iniciada esta cuenta.
            </p>

            <Link
              href="/cart"
              className="mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704]"
            >
              <ShoppingBag size={20} />
              Crear un pedido
            </Link>
          </section>
        ) : (
          <section className="mt-8 space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </section>
        )}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/20 bg-[#210D08]/75 px-5 py-3 font-black text-[#F5ACB1]"
          >
            <RefreshCcw size={18} />
            Actualizar pedidos
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#120704] px-5 py-8 text-[#FFF6EF] md:px-10 lg:px-20">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,155,85,0.14),transparent_38%)]" />

      {children}
    </main>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Loader2
          size={46}
          className="mx-auto animate-spin text-[#F5ACB1]"
        />

        <p className="mt-4 font-black text-[#F5ACB1]">{message}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.7rem] border border-[#F5ACB1]/15 bg-[#120704]/65 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5ACB1] text-[#120704]">
        {icon}
      </div>

      <p className="mt-4 text-3xl font-black text-[#F5ACB1]">{value}</p>

      <p className="mt-1 text-sm text-[#FFF6EF]/50">{label}</p>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const status = order.status || "Pendiente";
  const paymentStatus = order.paymentStatus || "Pendiente";
  const deliveryLabel =
    order.delivery === "delivery" ? "Delivery" : "Recogido";

  return (
    <article className="overflow-hidden rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 shadow-2xl shadow-black/25">
      <div className="border-b border-[#F5ACB1]/12 p-6 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D99B55]">
              Orden
            </p>

            <h2 className="mt-2 break-all text-xl font-black text-[#F5ACB1]">
              #{order.id}
            </h2>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#FFF6EF]/55">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} />
                {formatDate(order.createdAt)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Truck size={16} />
                {deliveryLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatusBadge value={status} />
            <PaymentBadge value={paymentStatus} />
          </div>
        </div>
      </div>

      <div className="p-6 md:p-7">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#F5ACB1]/20 p-5 text-center text-[#FFF6EF]/50">
            Este pedido no contiene productos visibles.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => {
              const quantity = Number(item.qty || 0);
              const price = Number(item.price || 0);
              const lineTotal =
                typeof item.lineTotal === "number"
                  ? item.lineTotal
                  : quantity * price;

              return (
                <div
                  key={`${item.id || item.name || "item"}-${index}`}
                  className="flex items-center gap-4 rounded-[1.7rem] border border-[#F5ACB1]/12 bg-[#120704]/60 p-4"
                >
                  <SafeOrderImage
                    src={normalizeImage(item.image, item.name)}
                    alt={item.name || "Cookie Ianis Bakery"}
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-[#F5ACB1]">
                      {item.name || "Cookie Ianis Bakery"}
                    </h3>

                    <p className="mt-1 text-sm text-[#FFF6EF]/50">
                      {quantity} × ${price.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-black text-[#D99B55]">
                    ${lineTotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[1.7rem] border border-[#F5ACB1]/12 bg-[#120704]/50 p-5">
            <p className="font-black text-[#F5ACB1]">Información del pedido</p>

            <div className="mt-4 space-y-3 text-sm leading-6 text-[#FFF6EF]/60">
              <p>
                <strong className="text-[#FFF6EF]">Cliente:</strong>{" "}
                {order.customerName || "No disponible"}
              </p>

              <p>
                <strong className="text-[#FFF6EF]">Teléfono:</strong>{" "}
                {order.customerPhone || "No disponible"}
              </p>

              {order.delivery === "delivery" && (
                <p>
                  <strong className="text-[#FFF6EF]">Dirección:</strong>{" "}
                  {order.address || "No disponible"}
                </p>
              )}

              <p>
                <strong className="text-[#FFF6EF]">Nota:</strong>{" "}
                {order.note || "Sin nota especial"}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-[1.7rem] border border-[#F5ACB1]/12 bg-[#120704]/70 p-5">
            <PriceRow
              label="Subtotal"
              value={`$${Number(order.subtotal || 0).toFixed(2)}`}
            />

            <PriceRow
              label="Descuento"
              value={`-$${Number(order.discount || 0).toFixed(2)}`}
            />

            <PriceRow
              label="Delivery"
              value={`$${Number(order.deliveryFee || 0).toFixed(2)}`}
            />

            <div className="border-t border-[#F5ACB1]/15 pt-3">
              <PriceRow
                label="Total"
                value={`$${Number(order.total || 0).toFixed(2)}`}
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = normalizeText(value);

  const completed = [
    "completado",
    "completada",
    "completed",
    "entregado",
    "entregada",
  ].includes(normalized);

  const cancelled = [
    "cancelado",
    "cancelada",
    "cancelled",
    "rechazado",
    "rechazada",
  ].includes(normalized);

  const styles = completed
    ? "border-green-500/25 bg-green-500/10 text-green-200"
    : cancelled
      ? "border-red-400/25 bg-red-400/10 text-red-200"
      : "border-[#D99B55]/25 bg-[#D99B55]/10 text-[#F1C581]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black ${styles}`}
    >
      {completed ? (
        <CheckCircle2 size={15} />
      ) : (
        <Clock3 size={15} />
      )}

      {value}
    </span>
  );
}

function PaymentBadge({ value }: { value: string }) {
  const paid = ["pagado", "paid", "completado", "completed"].includes(
    normalizeText(value)
  );

  return (
    <span
      className={`rounded-full border px-4 py-2 text-xs font-black ${
        paid
          ? "border-green-500/25 bg-green-500/10 text-green-200"
          : "border-[#F5ACB1]/20 bg-[#F5ACB1]/10 text-[#F5ACB1]"
      }`}
    >
      Pago: {value}
    </span>
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
            : "font-black"
        }
      >
        {value}
      </span>
    </div>
  );
}

function SafeOrderImage({ src, alt }: { src: string; alt: string }) {
  const [currentSource, setCurrentSource] = useState(src);

  return (
    <Image
      src={currentSource}
      alt={alt}
      width={74}
      height={74}
      className="h-16 w-16 shrink-0 rounded-2xl object-cover"
      onError={() => {
        if (currentSource !== "/logo-ianis.png") {
          setCurrentSource("/logo-ianis.png");
        }
      }}
    />
  );
}

function mapOrderDocument(
  document: QueryDocumentSnapshot<DocumentData>
): Order {
  const data = document.data();

  return {
    id: document.id,
    customerId:
      typeof data.customerId === "string" ? data.customerId : "",
    customerEmail:
      typeof data.customerEmail === "string" ? data.customerEmail : "",
    customerName:
      typeof data.customerName === "string" ? data.customerName : "",
    customerPhone:
      typeof data.customerPhone === "string" ? data.customerPhone : "",
    address: typeof data.address === "string" ? data.address : "",
    note: typeof data.note === "string" ? data.note : "",
    delivery:
      typeof data.delivery === "string" ? data.delivery : "pickup",
    coupon: typeof data.coupon === "string" ? data.coupon : "",
    items: Array.isArray(data.items) ? data.items : [],
    itemCount:
      typeof data.itemCount === "number" ? data.itemCount : undefined,
    subtotal: Number(data.subtotal || 0),
    discount: Number(data.discount || 0),
    deliveryFee: Number(data.deliveryFee || 0),
    total: Number(data.total || 0),
    status: typeof data.status === "string" ? data.status : "Pendiente",
    paymentStatus:
      typeof data.paymentStatus === "string"
        ? data.paymentStatus
        : "Pendiente",
    source: typeof data.source === "string" ? data.source : "",
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
}

function normalizeImage(image?: string, name?: string) {
  const productName = (name || "").toLowerCase();

  if (productName.includes("nutella")) return "/nutella.png";
  if (productName.includes("peanut")) return "/peanut-butter.png";

  if (
    productName.includes("double") ||
    productName.includes("doble")
  ) {
    return "/double-chocolate.png";
  }

  if (productName.includes("dulce")) return "/dulce-leche.png";

  if (
    productName.includes("marshmallow") ||
    productName.includes("malvavisco")
  ) {
    return "/marshmallow.png";
  }

  if (
    productName.includes("coconut") ||
    productName.includes("coco")
  ) {
    return "/coconut.png";
  }

  if (!image) return "/logo-ianis.png";

  let normalized = image.trim();

  normalized = normalized.replace(/^https?:\/\/[^/]+/, "");
  normalized = normalized.replace("/cookies/", "/");

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
}

function formatDate(value: Order["createdAt"]) {
  const timestamp = getTimestamp(value);

  if (!timestamp) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-PR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function getTimestamp(value: Order["createdAt"]) {
  if (!value) {
    return 0;
  }

  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

function normalizeText(value?: string) {
  return (value || "").trim().toLowerCase();
            }
