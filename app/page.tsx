import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Cookie,
  Gift,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

const flavors = [
  {
    name: "Peanut Butter Explosion",
    description:
      "Cookie suave con mantequilla de maní cremosa y chips de chocolate.",
    price: "$4.99",
    tag: "Nuevo",
    image: "/peanut-butter.png",
  },
  {
    name: "Double Chocolate Lava",
    description:
      "Chocolate intenso con chips de chocolate y relleno cremoso fundido.",
    price: "$4.99",
    tag: "Favorito",
    image: "/double-chocolate.png",
  },
  {
    name: "Dulce de Leche Dream",
    description:
      "Cookie artesanal rellena de dulce de leche suave y delicioso.",
    price: "$4.99",
    tag: "Premium",
    image: "/dulce-leche.png",
  },
  {
    name: "Marshmallow Chocolate",
    description:
      "Malvavisco suave, chocolate irresistible y una textura única.",
    price: "$5.49",
    tag: "Especial",
    image: "/marshmallow.png",
  },
  {
    name: "Coconut Paradise",
    description:
      "Masa de chocolate con relleno de coco cremoso y coco rallado.",
    price: "$5.49",
    tag: "Tropical",
    image: "/coconut.png",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[#120704] text-[#FFF6EF]">
      <section className="relative px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.20),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(217,155,85,0.18),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_520px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/75 px-5 py-3 text-sm font-black text-[#F5ACB1] backdrop-blur">
              <Sparkles size={17} />
              Frescas todos los días
            </div>

            <h1 className="mt-7 max-w-4xl text-[3.4rem] font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[5.6rem]">
              Cookies gourmet rellenas hasta el centro.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#FFF6EF]/70 md:text-xl md:leading-9">
              Ianis Bakery crea galletas artesanales premium con rellenos
              cremosos, sabores intensos y una presentación hecha para enamorar.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] shadow-2xl shadow-[#F5ACB1]/20 transition hover:bg-[#FFF6EF]"
              >
                Ver tienda
                <ArrowRight className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/box-builder"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/25 bg-[#210D08]/75 px-8 py-5 font-black text-[#FFF6EF]"
              >
                <Gift size={20} />
                Crear mi caja
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <Stat value="100%" label="Artesanal" />
              <Stat value="5" label="Sabores" />
              <Stat value="Premium" label="Calidad" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-8 rounded-full bg-[#F5ACB1]/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.7rem] border border-[#F5ACB1]/20 bg-[#210D08]/80 p-3 shadow-2xl shadow-black/60">
              <Image
                src="/double-chocolate.png"
                alt="Double Chocolate Lava de Ianis Bakery"
                width={1024}
                height={1536}
                className="aspect-[4/5] w-full rounded-[2.2rem] object-cover"
                priority
              />
            </div>

            <div className="relative z-10 mx-3 -mt-1 rounded-[2rem] border border-[#F5ACB1]/20 bg-[#210D08] p-5 shadow-2xl md:mx-8 md:-mt-10">
              <div className="flex gap-1 text-[#D99B55]">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="mt-3 text-lg font-black">
                Pura tentación en cada bocado.
              </p>

              <p className="mt-1 text-sm text-[#FFF6EF]/55">
                Double Chocolate Lava
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-[#D99B55]">
              Nuestros sabores
            </p>

            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Menú gourmet
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FFF6EF]/60">
              Cookies grandes, rellenas y preparadas para convertir cada pedido
              en una experiencia especial.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {flavors.map((flavor) => (
              <article
                key={flavor.name}
                className="group overflow-hidden rounded-[2.3rem] border border-[#E6B47C]/30 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/30 transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EEDAC8]">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-[#C95867] px-4 py-2 text-xs font-black text-white">
                      {flavor.tag}
                    </span>

                    <span className="rounded-full bg-[#120704] px-4 py-2 text-sm font-black text-[#F5ACB1]">
                      {flavor.price}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-black uppercase tracking-tight">
                    {flavor.name}
                  </h3>

                  <div className="mt-3 flex gap-1 text-[#D99B55]">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Star key={item} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <p className="mt-4 min-h-20 text-sm leading-6 text-[#2A120B]/70">
                    {flavor.description}
                  </p>

                  <Link
                    href="/cart"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C95867] px-6 py-4 font-black text-white shadow-xl"
                  >
                    <ShoppingBag size={18} />
                    Ordenar
                  </Link>
                </div>
              </article>
            ))}

            <article className="flex min-h-[520px] flex-col items-center justify-center rounded-[2.3rem] border border-dashed border-[#F5ACB1]/30 bg-[#210D08]/70 p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5ACB1] text-[#120704]">
                <Cookie size={36} />
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-[#D99B55]">
                Próximamente
              </p>

              <h3 className="mt-3 text-3xl font-black text-[#F5ACB1]">
                Nuevo sabor
              </h3>

              <p className="mt-4 max-w-sm leading-7 text-[#FFF6EF]/60">
                Seguiremos agregando sabores desde el catálogo administrativo.
              </p>

              <Link
                href="/taste"
                className="mt-7 rounded-full border border-[#F5ACB1]/25 px-6 py-4 font-black text-[#F5ACB1]"
              >
                Sugerir un sabor
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <Feature
            icon={<Heart />}
            title="Hechas con amor"
            description="Cada cookie se prepara para sentirse especial desde la primera mordida."
          />

          <Feature
            icon={<BadgeCheck />}
            title="Calidad premium"
            description="Sabores intensos, rellenos cremosos y una presentación profesional."
          />

          <Feature
            icon={<Gift />}
            title="Perfectas para regalar"
            description="Cajas personalizadas para cumpleaños, reuniones y detalles especiales."
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#F5ACB1]/15 bg-[#210D08]/70 p-4">
      <p className="text-xl font-black text-[#F5ACB1] md:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-[#FFF6EF]/50">{label}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#210D08]/80 p-7">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
        {icon}
      </div>

      <h3 className="mt-5 text-2xl font-black text-[#F5ACB1]">{title}</h3>

      <p className="mt-3 leading-7 text-[#FFF6EF]/60">{description}</p>
    </article>
  );
  }
