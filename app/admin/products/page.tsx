import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  DollarSign,
  Edit,
  Package,
  Plus,
  Star,
} from "lucide-react";

const products = [
  {
    name: "Nutella Supreme",
    price: "$3.50",
    status: "Activo",
    tag: "Más vendido",
    desc: "Cookie gourmet rellena con Nutella cremosa hasta el centro.",
  },
  {
    name: "Double Chocolate Lava",
    price: "$3.75",
    status: "Activo",
    tag: "Premium",
    desc: "Chocolate intenso con centro suave estilo lava.",
  },
  {
    name: "Dulce de Leche Dream",
    price: "$3.50",
    status: "Activo",
    tag: "Favorito",
    desc: "Dulce de leche artesanal con textura suave.",
  },
  {
    name: "Peanut Butter Explosion",
    price: "$3.50",
    status: "Prueba",
    tag: "Nuevo",
    desc: "Mantequilla de maní cremosa con balance perfecto.",
  },
];

export default function AdminProductsPage() {
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
                  Productos
                </p>
                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  Menú de Cookies
                </h1>
                <p className="mt-2 text-sm text-[#FFF3EE]/55">
                  Administra sabores, precios y estado de cada producto.
                </p>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-6 py-4 font-black text-[#050202]">
              <Plus />
              Nuevo producto
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <Stat icon={<Cookie />} label="Productos" value="4" />
          <Stat icon={<Package />} label="Activos" value="3" />
          <Stat icon={<DollarSign />} label="Precio promedio" value="$3.56" />
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/25"
            >
              <div className="mb-5 flex h-24 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#F2B6AD] to-[#D8A85B] text-[#050202]">
                <Cookie size={48} />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="rounded-full bg-[#2A1713] px-3 py-1 text-xs font-black text-[#D8A85B]">
                    {product.tag}
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-[#F2B6AD]">
                    {product.name}
                  </h2>
                </div>

                <p className="rounded-full bg-[#F2B6AD] px-3 py-1 font-black text-[#050202]">
                  {product.price}
                </p>
              </div>

              <p className="mt-4 min-h-20 leading-7 text-[#FFF3EE]/65">
                {product.desc}
              </p>

              <div className="mt-5 flex items-center gap-1 text-[#D8A85B]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <span className="rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 px-4 py-3 text-center text-sm font-black text-[#F2B6AD]">
                  {product.status}
                </span>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F2B6AD] px-4 py-3 text-sm font-black text-[#050202]">
                  <Edit size={16} />
                  Editar
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
function Stat({
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
