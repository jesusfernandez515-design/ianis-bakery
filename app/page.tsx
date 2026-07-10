import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Gift,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

const flavors = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    description:
      "Cookie con chispas de chocolate, rellena de Nutella cremosa y decorada con una galleta.",
    price: "$4.99",
    tag: "Nueva",
    image: "/nutella.png",
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Explosion",
    description:
      "Mantequilla de maní cremosa con deliciosas chispas de chocolate.",
    price: "$4.99",
    tag: "Especial",
    image: "/peanut-butter.png",
  },
  {
    id: "double-chocolate",
    name: "Double Chocolate Lava",
    description:
      "Chocolate intenso con chips y un irresistible centro fundido.",
    price: "$4.99",
    tag: "Favorita",
    image: "/double-chocolate.png",
  },
  {
    id: "dulce-leche",
    name: "Dulce de Leche Dream",
    description:
      "Cookie artesanal rellena de dulce de leche suave y cremoso.",
    price: "$4.99",
    tag: "Premium",
    image: "/dulce-leche.png",
  },
  {
    id: "marshmallow",
    name: "Marshmallow Chocolate",
    description:
      "Malvavisco suave, chocolate y una combinación irresistible.",
    price: "$5.49",
    tag: "Especial",
    image: "/marshmallow.png",
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    description:
      "Chocolate con relleno cremoso de coco y coco rallado.",
    price: "$5.49",
    tag: "Tropical",
    image: "/coconut.png",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[#120704] text-[#FFF6EF]">
      <section className="relative px-5 pb-14 pt-10 md:px-10 md:pb-24 md:pt-16 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.20),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(217,155,85,0.18),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_520px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/75 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <Sparkles size={17} />
              Frescas todos los días
            </div>

            <h1 className="mt-7 max-w-4xl text-[3.2rem] font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Cookies gourmet rellenas hasta el centro.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#FFF6EF]/70 md:text-xl">
              Ianis Bakery crea galletas artesanales premium con rellenos
              cremosos, sabores intensos y una presentación hecha para
              enamorar.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704]"
              >
                Ver tienda
                <ArrowRight />
              </Link>

              <Link
                href="/box-builder"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#F5ACB1]/25 bg-[#210D08]/75 px-8 py-5 font-black"
              >
                <Gift size={20} />
                Crear mi caja
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <Stat value="100%" label="Artesanal" />
              <Stat value="6" label="Sabores" />
              <Stat value="Premium" label="Calidad" />
            </div>
          </div>

          <article className="overflow-hidden rounded-[2.7rem] border border-[#F5ACB1]/20 bg-[#210D08] shadow-2xl shadow-black/50">
            <div className="relative aspect-[3/4]">
              <Image
                src="/nutella.png"
                alt="Nutella Supreme de Ianis Bakery"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
                priority
              />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#C95867] px-4 py-2 text-xs font-black text-white">
                  Nueva
                </span>

                <span className="rounded-full bg-[#F5ACB1] px-4 py-2 text-sm font-black text-[#120704]">
                  $4.99
                </span>
              </div>

              <div className="mt-5 flex gap-1 text-[#D99B55]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="currentColor" />
                ))}
              </div>

              <h2 className="mt-4 text-3xl font-black text-[#F5ACB1]">
                Nutella Supreme
              </h2>

              <p className="mt-3 leading-7 text-[#FFF6EF]/65">
                Una nueva cookie rellena de Nutella cremosa y preparada para
                convertirse en tu favorita.
              </p>

              <Link
                href="/cart"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5ACB1] px-6 py-4 font-black text-[#120704]"
              >
                <ShoppingBag size={19} />
                Ordenar
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="px-5 py-14 md:px-10 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-[#D99B55]">
              Nuestros sabores
            </p>

            <h2 className="mt-4 text-5xl font-black md:text-7xl">
              Menú gourmet
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FFF6EF]/60">
              Seis sabores grandes, rellenos y preparados para convertir cada
              pedido en una experiencia especial.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {flavors.map((flavor) => (
              <article
                key={flavor.id}
                className="overflow-hidden rounded-[2.3rem] border border-[#E6B47C]/30 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/30"
              >
                <div className="relative aspect-[3/4] bg-[#EEDAC8]">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#C95867] px-4 py-2 text-xs font-black text-white">
                      {flavor.tag}
                    </span>

                    <span className="rounded-full bg-[#120704] px-4 py-2 text-sm font-black text-[#F5ACB1]">
                      {flavor.price}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-black uppercase leading-tight">
                    {flavor.name}
                  </h3>

                  <div className="mt-3 flex gap-1 text-[#D99B55]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#2A120B]/70">
                    {flavor.description}
                  </p>

                  <Link
                    href="/cart"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C95867] px-6 py-4 font-black text-white"
                  >
                    <ShoppingBag size={18} />
                    Ordenar
                  </Link>
                </div>
              </article>
            ))}
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
            description="Sabores intensos, rellenos cremosos y presentación profesional."
          />

          <Feature
            icon={<Gift />}
            title="Perfectas para regalar"
            description="Cajas personalizadas para cumpleaños, reuniones y detalles."
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
