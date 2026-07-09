"use client";

import Image from "next/image";
import Link from "next/link";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  Clock,
  Cookie,
  DollarSign,
  MessageCircle,
  Phone,
  Printer,
  Search,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";

type OrderItem = {
  id?: string;
  name?: string;
  price?: number;
  qty?: number;
  image?: string;
};

type Order = {
  id: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  note?: string;
  delivery?: "pickup" | "delivery";
  coupon?: string;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  total?: number;
  status?: string;
  paymentStatus?: string;
  source?: string;
  createdAt?: {
    seconds?: number;
  };
};

const statuses = [
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Horneando",
  "Listo para recoger",
  "En ruta",
  "Entregado",
  "Cancelado",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Order[];

      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const text = `${order.id} ${order.customerName || ""} ${
        order.customerPhone || ""
      } ${order.status || ""}`
        .toLowerCase()
        .trim();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "Todos" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const todayOrders = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();

    return orders.filter((order) => {
      if (!order.createdAt?.seconds) return false;
      return new Date(order.createdAt.seconds * 1000).toDateString() === today;
    });
  }, [orders]);

  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const pendingCount = orders.filter(
    (order) =>
      order.status === "Pendiente" ||
      order.status === "Confirmado" ||
      order.status === "En preparación" ||
      order.status === "Horneando"
  ).length;

  const readyCount = orders.filter(
    (order) =>
      order.status === "Listo para recoger" || order.status === "En ruta"
  ).length;

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
      alert("Error actualizando el estado.");
    } finally {
      setUpdatingId("");
    }
  };

  const printOrder = (order: Order) => {
    const content = `
      IANIS BAKERY
      Pedido: ${order.id}
      Cliente: ${order.customerName || "Sin nombre"}
      Teléfono: ${order.customerPhone || "N/A"}
      Estado: ${order.status || "Pendiente"}
      Entrega: ${order.delivery === "delivery" ? "Delivery" : "Recogido"}
      Dirección: ${order.address || "N/A"}

      Productos:
      ${(order.items || [])
        .map(
          (item) =>
            `${item.qty || 0} x ${item.name || "Producto"} - $${(
              Number(item.price || 0) * Number(item.qty || 0)
            ).toFixed(2)}`
        )
        .join("\n")}

      Subtotal: $${Number(order.subtotal || 0).toFixed(2)}
      Descuento: $${Number(order.discount || 0).toFixed(2)}
      Delivery: $${Number(order.deliveryFee || 0).toFixed(2)}
      Total: $${Number(order.total || 0).toFixed(2)}

      Nota: ${order.note || "Sin nota"}
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`<pre>${content}</pre>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-8 text-[#FFF6EF]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black text-[#F5ACB1]"
        >
          <ArrowLeft size={18} />
          Volver al dashboard
        </Link>

        <header className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={84}
                height={84}
                className="rounded-full border border-[#FFF6EF]/70 object-contain"
                priority
              />

              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D99B55]">
                  Pedidos en tiempo real
                </p>
                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  Centro de órdenes
                </h1>
                <p className="mt-2 text-sm text-[#FFF6EF]/55">
                  Administra pedidos reales guardados en Firestore.
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-6 py-4 font-black text-[#120704]"
            >
              <ShoppingBag />
              Abrir tienda
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<ShoppingBag />}
            label="Pedidos totales"
            value={orders.length.toString()}
          />
          <StatCard
            icon={<DollarSign />}
            label="Ingresos hoy"
            value={`$${todayRevenue.toFixed(2)}`}
          />
          <StatCard
            icon={<Clock />}
            label="En proceso"
            value={pendingCount.toString()}
          />
          <StatCard
            icon={<Truck />}
            label="Listos / ruta"
            value={readyCount.toString()}
          />
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#D99B55]">
                Gestión
              </p>
              <h2 className="mt-2 text-3xl font-black">Pedidos recientes</h2>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex items-center gap-2 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-4 py-3">
                <Search size={18} className="text-[#F5ACB1]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cliente, teléfono o ID..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#FFF6EF]/35 md:w-80"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-4 py-3 text-sm font-bold text-[#FFF6EF] outline-none"
              >
                <option value="Todos" className="bg-[#120704]">
                  Todos
                </option>
                {statuses.map((status) => (
                  <option key={status} value={status} className="bg-[#120704]">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          {filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#F5ACB1]/25 bg-[#210D08]/70 p-10 text-center">
              <Cookie className="mx-auto mb-4 text-[#F5ACB1]" size={48} />
              <h2 className="text-3xl font-black">No hay pedidos</h2>
              <p className="mt-2 text-[#FFF6EF]/55">
                Cuando alguien cree un pedido desde el carrito, aparecerá aquí.
              </p>
            </div>
          ) : (
            filtered.map((order) => {
              const whatsappUrl = `https://wa.me/${cleanPhone(
                order.customerPhone
              )}?text=${encodeURIComponent(
                `Hola ${
                  order.customerName || ""
                }, te escribimos de Ianis Bakery sobre tu pedido ${order.id}. Estado actual: ${
                  order.status || "Pendiente"
                }.`
              )}`;

              return (
                <article
                  key={order.id}
                  className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#210D08]/90 p-5 shadow-2xl shadow-black/25"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-[#D99B55]">
                        Pedido {order.id.slice(0, 8)}
                      </p>

                      <h2 className="mt-2 text-3xl font-black text-[#F5ACB1]">
                        {order.customerName || "Cliente sin nombre"}
                      </h2>

                      <div className="mt-4 grid gap-3 text-sm text-[#FFF6EF]/70 md:grid-cols-2">
                        <Info icon={<Phone size={16} />} text={order.customerPhone || "Sin teléfono"} />
                        <Info icon={<Clock size={16} />} text={formatDate(order.createdAt?.seconds)} />
                        <Info
                          icon={<Truck size={16} />}
                          text={order.delivery === "delivery" ? "Delivery" : "Recogido"}
                        />
                        <Info
                          icon={<DollarSign size={16} />}
                          text={`$${Number(order.total || 0).toFixed(2)}`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <Status status={order.status || "Pendiente"} />

                      <select
                        value={order.status || "Pendiente"}
                        disabled={updatingId === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/80 px-4 py-3 text-sm font-black text-[#FFF6EF] outline-none"
                      >
                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#120704]"
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#F5ACB1]/15 bg-[#120704]/70 p-4">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-[#D99B55]">
                      Productos
                    </p>

                    <div className="space-y-3">
                      {(order.items || []).map((item, index) => (
                        <div
                          key={`${item.id || item.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl bg-[#210D08]/80 px-4 py-3"
                        >
                          <div>
                            <p className="font-black text-[#F5ACB1]">
                              {item.name || "Producto"}
                            </p>
                            <p className="text-sm text-[#FFF6EF]/55">
                              Cantidad: {item.qty || 0}
                            </p>
                          </div>

                          <p className="font-black">
                            $
                            {(
                              Number(item.price || 0) * Number(item.qty || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(order.address || order.note) && (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <Detail title="Dirección" text={order.address} />
                      <Detail title="Nota" text={order.note} />
                    </div>
                  )}

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <a
                      href={`tel:${order.customerPhone || ""}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-5 py-4 font-black text-[#F5ACB1]"
                    >
                      <Phone size={18} />
                      Llamar
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 font-black text-white"
                    >
                      <MessageCircle size={18} />
                      WhatsApp
                    </a>

                    <button
                      onClick={() => printOrder(order)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/75 px-5 py-4 font-black text-[#FFF6EF]"
                    >
                      <Printer size={18} />
                      Imprimir
                    </button>

                    <Link
                      href="/admin/analytics"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F5ACB1] px-5 py-4 font-black text-[#120704]"
                    >
                      <User size={18} />
                      Analytics
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}

function cleanPhone(phone?: string) {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

function formatDate(seconds?: number) {
  if (!seconds) return "Fecha no disponible";

  return new Date(seconds * 1000).toLocaleString("es-PR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#210D08]/90 p-6 shadow-2xl shadow-black/30">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
        {icon}
      </div>
      <p className="text-sm text-[#FFF6EF]/55">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#F5ACB1]">{value}</p>
    </div>
  );
}

function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#F5ACB1]/10 bg-[#120704]/70 px-4 py-3">
      <span className="text-[#F5ACB1]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Detail({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border border-[#F5ACB1]/10 bg-[#120704]/70 p-4">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#D99B55]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#FFF6EF]/70">
        {text || "Sin información"}
      </p>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const styles =
    status === "Pendiente"
      ? "bg-[#D99B55] text-[#120704]"
      : status === "Confirmado"
      ? "bg-[#F5ACB1] text-[#120704]"
      : status === "En preparación"
      ? "bg-[#C95867] text-white"
      : status === "Horneando"
      ? "bg-[#A74250] text-white"
      : status === "Listo para recoger"
      ? "bg-[#FFF6EF] text-[#120704]"
      : status === "En ruta"
      ? "bg-[#25D366] text-white"
      : status === "Entregado"
      ? "bg-green-700 text-white"
      : "bg-gray-700 text-white";

  return (
    <span className={`rounded-full px-5 py-3 text-sm font-black ${styles}`}>
      {status}
    </span>
  );
        }
