import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Cookie,
  DollarSign,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

const orders = [
  {
    id: "ORD-1001",
    customer: "Cliente de muestra",
    phone: "(787) 000-0000",
    items: "2 Nutella Supreme, 1 Double Chocolate Lava",
    total: "$10.75",
    status: "Pendiente",
    time: "Hoy · 10:30 AM",
  },
  {
    id: "ORD-1002",
    customer: "Pedido familiar",
    phone: "(787) 000-0000",
    items: "6 cookies variadas",
    total: "$21.00",
    status: "Preparando",
    time: "Hoy · 11:15 AM",
  },
  {
    id: "ORD-1003",
    customer: "Caja regalo",
    phone: "(787) 000-0000",
    items: "12 cookies premium",
    total: "$42.00",
    status: "Listo",
    time: "Hoy · 12:20 PM",
  },
];

const stats = [
  {
    label: "Pedidos hoy",
    value: "3",
    icon: <ShoppingBag />,
  },
  {
    label: "Ingresos estimados",
    value: "$73.75",
    icon: <DollarSign />,
  },
  {
    label: "Pendientes",
    value: "1",
    icon: <Clock />,
  },
  {
    label: "Listos",
    value: "1",
    icon: <Truck />,
  },
];

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-[#050202] px-5 py-8 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(242,182,173,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.14),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black text-[#F2B6AD]"
        >
          <ArrowLeft size={18} />
          Volver al dashboard
        </Link>

        <header className="rounded-[2.5rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={84}
                height={84}
                className="rounded-full border border-[#FFF3EE]/60 object-contain"
                priority
              />

              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D8A85B]">
                  Pedidos
                </p>
                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  Centro de órdenes
                </h1>
                <p className="mt-2 text-sm text-[#FFF3EE]/55">
                  Administra pedidos, estados, clientes y ventas del día.
                </p>
              </div>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-6 py-4 font-black text-[#050202]"
            >
              <Cookie />
              Ver menú
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                Gestión
              </p>
              <h2 className="mt-2 text-2xl font-black">Pedidos recientes</h2>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 px-4 py-3">
              <Search size={18} className="text-[#F2B6AD]" />
              <input
                placeholder="Buscar pedido, cliente o teléfono..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#FFF3EE]/35 md:w-80"
              />
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/25"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                    {order.id}
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-[#F2B6AD]">
                    {order.customer}
                  </h2>

                  <div className="mt-4 grid gap-3 text-sm text-[#FFF3EE]/65 md:grid-cols-2">
                    <Info icon={<Phone size={16} />} text={order.phone} />
                    <Info icon={<Clock size={16} />} text={order.time} />
                    <Info icon={<Cookie size={16} />} text={order.items} />
                    <Info icon={<DollarSign size={16} />} text={order.total} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <Status status={order.status} />

                  <div className="grid grid-cols-2 gap-3">
                    <button className="rounded-2xl border border-[#E8A39A]/20 bg-[#050202]/70 px-5 py-3 text-sm font-black text-[#F2B6AD]">
                      Ver detalles
                    </button>

                    <button className="rounded-2xl bg-[#F2B6AD] px-5 py-3 text-sm font-black text-[#050202]">
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[2.5rem] border border-[#E8A39A]/25 bg-gradient-to-br from-[#F2B6AD] to-[#D8A85B] p-8 text-[#050202] shadow-2xl shadow-[#E8A39A]/20 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em]">
                Próximo nivel
              </p>

              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Conectar pedidos reales.
              </h2>

              <p className="mt-4 max-w-2xl text-lg text-[#2A1713]/80">
                Este módulo está listo para conectarse con WhatsApp, Firebase,
                Stripe o ATH Móvil para recibir pedidos reales de clientes.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#050202] px-8 py-5 text-lg font-black text-[#FFF3EE]"
            >
              Abrir menú
              <ShoppingBag />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
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
    <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2B6AD] text-[#050202]">
        {icon}
      </div>
      <p className="text-sm text-[#FFF3EE]/55">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#F2B6AD]">{value}</p>
    </div>
  );
}

function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#E8A39A]/10 bg-[#050202]/70 px-4 py-3">
      <span className="text-[#F2B6AD]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const styles =
    status === "Pendiente"
      ? "bg-[#D8A85B] text-[#050202]"
      : status === "Preparando"
      ? "bg-[#F2B6AD] text-[#050202]"
      : status === "Listo"
      ? "bg-[#FFF3EE] text-[#050202]"
      : "bg-[#2A1713] text-[#FFF3EE]";

  return (
    <span className={`rounded-full px-5 py-3 text-sm font-black ${styles}`}>
      {status}
    </span>
  );
                    }
