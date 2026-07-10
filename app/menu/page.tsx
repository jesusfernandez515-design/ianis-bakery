import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

const cookies = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    price: "$4.99",
    tag: "Nueva",
    description:
      "Cookie con chispas de chocolate, rellena de Nutella cremosa y decorada con una galleta.",
    image: "/nutella.png",
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Explosion",
    price: "$4.99",
    tag: "Especial",
    description:
      "Mantequilla de maní cremosa con deliciosas chispas de chocolate.",
    image: "/peanut-butter.png",
  },
  {
    id: "double-chocolate",
    name: "Double Chocolate Lava",
    price: "$4.99",
    tag: "Favorita",
    description:
      "Chocolate intenso con chips y un irresistible centro fundido.",
    image: "/double-chocolate.png",
  },
  {
    id: "dulce-leche",
    name: "Dulce de Leche Dream",
    price: "$4.99",
    tag: "Premium",
    description:
      "Cookie artesanal rellena de dulce de leche suave y cremoso.",
    image: "/dulce-leche.png",
  },
  {
    id: "marshmallow",
    name: "Marshmallow Chocolate",
    price: "$5.49",
    tag: "Especial",
    description:
      "Malvavisco suave con chocolate y una combinación irresistible.",
    image: "/marshmallow.png",
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    price: "$5.49",
    tag: "Tropical",
    description:
      "Chocolate relleno de coco cremoso y cubierto con coco rallado.",
    image: "/coconut.png",
  },
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#120704] px-5 py-10 text-[#FFF6EF] md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-10 lg:grid-cols-[1fr_500px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/75 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <Sparkles size={17} />
              Menú gourmet premium
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[0.95] md:text-7xl">
              Elige tu cookie favorita.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF6EF]/65">
              Seis sabores artesanales, rellenos cremosos y una experiencia
              preparada para enamorar desde la primera mordida.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/box-builder"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704]"
              >
                Crear caja personalizada
                <Gift size={20} />
              </Link>

              <Link
                href="/taste"
                className="inline-flex items-center justify-center rounded-2xl border border-[#F5ACB1]/25 px-8 py-5 font-black"
              >
                Dejar opinión
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.7rem] border border-[#F5ACB1]/20 bg-[#210D08] p-3">
            <Image
              src="/cookie-boxes.png"
              alt="Cajas de cookies Ianis Bakery"
              width={1536}
              height={1024}
              className="aspect-[3/2] w-full rounded-[2.2rem] object-cover"
              priority
            />
          </div>
        </header>

        <section className="mt-16">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-[#D99B55]">
              Sabores
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-6xl">
              Sabores disponibles
            </h2>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {cookies.map((cookie) => (
              <article
                key={cookie.id}
                className="overflow-hidden rounded-[2.3rem] border border-[#E6B47C]/30 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/25"
              >
                <div className="relative aspect-[3/4] bg-[#EEDAC8]">
                  <Image
                    src={cookie.image}
                    alt={cookie.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#C95867] px-4 py-2 text-xs font-black text-white">
                      {cookie.tag}
                    </span>

                    <span className="rounded-full bg-[#120704] px-4 py-2 text-sm font-black text-[#F5ACB1]">
                      {cookie.price}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-black uppercase leading-tight">
                    {cookie.name}
                  </h3>

                  <div className="mt-3 flex gap-1 text-[#D99B55]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#2A120B]/70">
                    {cookie.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C95867]/25 px-4 py-3 font-black text-[#C95867]"
                    >
                      <Heart size={17} />
                      Favorito
                    </button>

                    <Link
                      href="/cart"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C95867] px-4 py-3 font-black text-white"
                    >
                      <ShoppingBag size={17} />
                      Ordenar
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2.7rem] bg-gradient-to-br from-[#F5ACB1] to-[#D99B55] p-8 text-[#120704] md:p-12">
          <h2 className="text-4xl font-black md:text-6xl">
            Prueba los seis sabores en una caja premium.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#120704]/70">
            Combina tus cookies favoritas en una caja de cuatro, seis o doce
            unidades.
          </p>

          <Link
            href="/box-builder"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#120704] px-8 py-5 font-black text-[#FFF6EF]"
          >
            Crear mi caja
            <ArrowRight />
          </Link>
        </section>
      </div>
    </div>
  );
}
