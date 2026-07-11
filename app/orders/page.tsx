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
} from "firebase/firestore";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  RefreshCcw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";

type OrderItem = {
  id?: string;
  name?: string;
  price?: number;
  qty?: number;
  quantity?: number;
  image?: string;
  lineTotal?: number;
};

type CustomerOrder = {
  id: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  note?: string;
  delivery?: "pickup" | "delivery";
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
  createdAt?: Timestamp | Date | string | null;
  updatedAt?: Timestamp | Date | string | null;
};

type PageNotice = {
  type: "error" | "info";
  message: string;
} | null;

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [notice, setNotice] = useState<PageNotice>(null);

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
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);
    setNotice(null);

    const ordersReference = collection(db, "orders");

    const customerOrdersQuery = query(
      ordersReference,
      where("customerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      customerOrdersQuery,
      (snapshot) => {
        const customerOrders = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as CustomerOrder[];

        customerOrders.sort(
          (firstOrder, secondOrder) =>
            getOrderTimestamp(secondOrder.createdAt) -
            getOrderTimestamp(firstOrder.createdAt)
        );

        setOrders(customerOrders);
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error cargando pedidos:", error);

        setOrders([]);
        setLoadingOrders(false);

        setNotice({
          type: "error",
          message:
            "No se pudieron cargar tus pedidos. Verifica las reglas de Firestore y vuelve a intentarlo.",
        });
      }
    );

    return unsubscribe;
  }, [user]);

  const totalSpent = useMemo(() => {
    return orders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    );
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = normalizeStatus(order.status);

      return [
        "pendiente",
        "pending",
        "confirmado",
        "confirmed",
        "preparando",
        "processing",
      ].includes(normalizedStatus);
    }).length;
  }, [orders]);

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#120704] px-5 text-[#FFF6EF]">
        <div className="text-center">
          <Loader2
            size={46}
            className="mx-auto animate-spin text-[#F5ACB1]"
          />

          <p className="mt-4 font-black text-[#F5ACB1]">
            Verificando tu cuenta...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#120704] px-5 py-10 text-[#FFF6EF]">
        <div className="mx-auto flex min-h-[78vh] max-w-lg items-center justify-center">
          <section className="w-full rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/92 p-7 text-center shadow-2xl shadow-black/45 md:p-9">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={120}
              height={120}
              className="mx-auto h-28 w-28 rounded-full border border-[#FFF6EF]/60 object-cover"
              priority
            />

            <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
              <Package size={32} />
            </div>

            <h1 className="mt-6 text-4xl font-black">
              Inicia sesión
            </h1>

            <p className="mt-4 leading-7 text-[#FFF6EF]/60">
              Debes iniciar sesión para consultar tus pedidos y su estado.
            </p>

            <Link
              href="/account"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704]"
            >
              Ir a mi cuenta
            </Link>

            <Link
              href="/shop"
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-8 py-5 font-black text-[#FFF6EF]"
            >
              <ShoppingBag size={20} />
              Ir a la tienda
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-8 text-[#FFF6EF] md:px-10 lg:px-20">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(217,155,85,0.16),transparent_38%)]" />

      <div className="mx-auto max-w-6xl">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 font-black text-[#F5ACB1]"
        >
          <ArrowLeft size={19} />
          Volver a mi cuenta
        </Link>

        <header className="mt-7 rounded-[2.7rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-6 shadow-2xl shadow-black/35 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#D99B55]">
                Ianis Bakery
              </p>

              <h1 className="mt-3 text-5xl font-black md:text-6xl">
                Mis pedidos
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-[#FFF6EF]/60">
                Consulta tus órdenes, productos seleccionados, totales y estado
                de preparación.
              </p>
            </div>

            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={120}
              height={120}
              className="h-28 w-28 rounded-full border border-[#FFF6EF]/60 object-cover"
              priority
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Pedidos"
              value={String(orders.length)}
            />

            <SummaryCard
              label="En proceso"
              value={String(pendingOrders)}
            />

            <SummaryCard
              label="Total comprado"
              value={`$${totalSpent.toFixed(2)}`}
            />
          </div>
        </header>

        {notice && (
          <div
            className={`mt-7 flex items-start gap-3 rounded-2xl border p-5 ${
              notice.type === "error"
                ? "border-red-400/25 bg-red-400/10 text-red-100"
                : "border-[#F5ACB1]/20 bg-[#F5ACB1]/10 text-[#FFF6EF]"
            }`}
          >
            <AlertCircle className="mt-0.5 shrink-0" size={22} />
            <p className="font-semibold leading-6">{notice.message}</p>
          </div>
        )}

        <section className="mt-8">
          {loadingOrders ? (
            <div className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 px-6 py-16 text-center">
              <Loader2
                size={42}
                className="mx-auto animate-spin text-[#F5ACB1]"
              />

              <p className="mt-4 font-black text-[#F5ACB1]">
                Cargando tus pedidos...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-[#F5ACB1]/25 bg-[#210D08]/70 px-6 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F5ACB1]/10 text-[#F5ACB1]">
                <Package size={38} />
              </div>

              <h2 className="mt-6 text-3xl font-black">
                No tienes pedidos vinculados
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-[#FFF6EF]/55">
                Los nuevos pedidos creados con tu sesión iniciada aparecerán
                aquí automáticamente.
              </p>

              <Link
                href="/cart"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704]"
              >
                <ShoppingBag size={20} />
                Crear un pedido
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function OrderCard({ order }: { order: CustomerOrder }) {
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const orderStatus = getStatusDetails(order.status);
  const paymentStatus = order.paymentStatus || "Pendiente";

  return (
    <article className="overflow-hidden rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 shadow-2xl shadow-black/25">
      <div className="border-b border-[#F5ACB1]/15 p-5 md:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D99B55]">
              Número de orden
            </p>

            <p className="mt-2 break-all text-lg font-black text-[#F5ACB1]">
              {order.id}
            </p>

            <p className="mt-2 text-sm text-[#FFF6EF]/50">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-black ${orderStatus.className}`}
          >
            {orderStatus.icon}
            {orderStatus.label}
          </div>
        </div>
      </div>

      <div className="grid gap-7 p-5 md:p-7 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-2xl font-black">
            Productos
          </h2>

          {orderItems.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#F5ACB1]/20 px-5 py-7 text-center text-[#FFF6EF]/50">
              Esta orden no contiene productos visibles.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {orderItems.map((item, index) => {
                const quantity = Number(
                  item.qty ?? item.quantity ?? 1
                );

                const price = Number(item.price || 0);

                const lineTotal =
                  typeof item.lineTotal === "number"
                    ? item.lineTotal
                    : quantity * price;

                return (
                  <div
                    key={`${item.id || item.name || "item"}-${index}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#F5ACB1]/12 bg-[#120704]/60 p-4"
                  >
                    <SafeOrderImage
                      src={item.image}
                      alt={item.name || "Cookie Ianis Bakery"}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-black text-[#F5ACB1]">
                        {item.name || "Producto Ianis Bakery"}
                      </p>

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
        </div>

        <aside className="h-fit rounded-[2rem] border border-[#F5ACB1]/15 bg-[#120704]/65 p-5">
          <h3 className="text-xl font-black text-[#F5ACB1]">
            Resumen
          </h3>

          <div className="mt-5 space-y-3">
            <OrderRow
              label="Subtotal"
              value={`$${Number(order.subtotal || 0).toFixed(2)}`}
            />

            <OrderRow
              label="Descuento"
              value={`-$${Number(order.discount || 0).toFixed(2)}`}
            />

            <OrderRow
              label="Delivery"
              value={`$${Number(order.deliveryFee || 0).toFixed(2)}`}
            />

            <div className="border-t border-[#F5ACB1]/15 pt-3">
              <OrderRow
                label="Total"
                value={`$${Number(order.total || 0).toFixed(2)}`}
                highlight
              />
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-[#F5ACB1]/15 pt-5 text-sm">
            <InformationRow
              label="Entrega"
              value={
                order.delivery === "delivery"
                  ? "Delivery"
                  : "Recogido"
              }
            />

            <InformationRow
              label="Pago"
              value={paymentStatus}
            />

            {order.delivery === "delivery" && (
              <InformationRow
                label="Dirección"
                value={order.address || "Sin dirección"}
              />
            )}

            {order.note && (
              <InformationRow
                label="Nota"
                value={order.note}
              />
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.7rem] border border-[#F5ACB1]/15 bg-[#120704]/65 p-5">
      <p className="text-3xl font-black text-[#F5ACB1]">
        {value}
      </p>

      <p className="mt-2 text-sm font-bold text-[#FFF6EF]/50">
        {label}
      </p>
    </div>
  );
}

function OrderRow({
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

function InformationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="font-black text-[#F5ACB1]">
        {label}
      </p>

      <p className="mt-1 break-words leading-6 text-[#FFF6EF]/55">
        {value}
      </p>
    </div>
  );
}

function SafeOrderImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const safeSource =
    typeof src === "string" && src.trim()
      ? src
      : "/logo-ianis.png";

  return (
    <Image
      src={safeSource}
      alt={alt}
      width={72}
      height={72}
      className="h-16 w-16 shrink-0 rounded-xl object-cover"
    />
  );
}

function getStatusDetails(status?: string) {
  const normalizedStatus = normalizeStatus(status);

  if (
    ["completado", "completed", "entregado", "delivered"].includes(
      normalizedStatus
    )
  ) {
    return {
      label: "Completado",
      icon: <CheckCircle2 size={17} />,
      className:
        "border-green-500/25 bg-green-500/10 text-green-200",
    };
  }

  if (
    ["cancelado", "cancelled", "rechazado", "rejected"].includes(
      normalizedStatus
    )
  ) {
    return {
      label: "Cancelado",
      icon: <XCircle size={17} />,
      className:
        "border-red-400/25 bg-red-400/10 text-red-200",
    };
  }

  if (
    ["preparando", "processing", "confirmado", "confirmed"].includes(
      normalizedStatus
    )
  ) {
    return {
      label: "En preparación",
      icon: <RefreshCcw size={17} />,
      className:
        "border-orange-400/25 bg-orange-400/10 text-orange-200",
    };
  }

  if (
    ["en camino", "on the way", "shipping", "delivery"].includes(
      normalizedStatus
    )
  ) {
    return {
      label: "En camino",
      icon: <Truck size={17} />,
      className:
        "border-blue-400/25 bg-blue-400/10 text-blue-200",
    };
  }

  return {
    label: status || "Pendiente",
    icon: <Clock3 size={17} />,
    className:
      "border-[#F5ACB1]/25 bg-[#F5ACB1]/10 text-[#F5ACB1]",
  };
}

function normalizeStatus(status?: string) {
  return (status || "pendiente")
    .trim()
    .toLowerCase();
}

function getOrderTimestamp(
  value?: Timestamp | Date | string | null
) {
  if (!value) return 0;

  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().getTime();
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime())
    ? 0
    : parsedDate.getTime();
}

function formatOrderDate(
  value?: Timestamp | Date | string | null
) {
  const timestamp = getOrderTimestamp(value);

  if (!timestamp) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-PR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(timestamp));
        }
