import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Cookie,
  Flame,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

const cookies = [
  {
    name: "Nutella Supreme",
    price: "$4.99",
    tag: "Más pedido",
    desc: "Galleta con chispas de chocolate rellena de Nutella y cubierta con más Nutella.",
    image: "/cookies/menu-board.png",
  },
  {
    name: "Peanut Butter Explosion",
    price: "$4.99",
    tag: "Nuevo",
    desc: "Cookie suave con mantequilla de maní cremosa y chips de chocolate.",
    image: "/cookies/peanut-butter.png",
  },
  {
    name: "Double Chocolate Lava",
    price: "$4.99",
    tag: "Chocolate lover",
    desc: "Chocolate intenso, centro suave y relleno de chocolate fundido.",
    image: "/cookies/double-chocolate.png",
  },
  {
    name: "Dulce de Leche Dream",
    price: "$4.99",
    tag: "Premium",
    desc: "Dulce de leche artesanal con una mordida suave, cremosa y deliciosa.",
    image: "/cookies/dulce-leche.png",
  },
  {
    name: "Marshmallow Chocolate",
    price: "$5.49",
    tag: "Sweet",
    desc: "Rellena de malvavisco suave y trozos de chocolate irresistibles.",
    image: "/cookies/marshmallow.png",
  },
  {
    name: "Coconut Paradise",
    price: "$5.49",
    tag: "Tropical",
    desc: "Chocolate relleno de coco cremoso y cubierta con coco rallado premium.",
    image: "/cookies/coconut.png",
  },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#120704] px-5 py-7 text-[#FFF6EF]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-[#F5ACB1]"
          >
            <ArrowLeft size={18} />
            Inicio
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={58}
              height={58}
              className="rounded-full border border-[#FFF6EF]/70 object-contain shadow-[0_0_24px_rgba(245,172,177,0.35)]"
              priority
            />
            <span className="hidden font-black text-[#F5ACB1] sm:inline">
              Ianis Bakery
            </span>
          </Link>

          <Link
            href="/cart"
            className="rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704]"
          >
            Ordenar
          </Link>
        </nav>

        <section className="grid gap-10 lg:grid-cols-[1fr_480px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <Sparkles size={17} />
              Menú gourmet premium
            </div>

            <h1 className="text-6xl font-black leading-[0.93] md:text-8xl">
              Elige tu cookie favorita.
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-9 text-[#FFF6EF]/70">
              Sabores artesanales, rellenos cremosos y una presentación diseñada
              para vender, regalar y enamorar desde la primera mordida.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704]"
              >
                Crear mi caja
                <ArrowRight />
              </Link>

              <Link
                href="/taste"
                className="inline-flex items-center justify-center rounded-2xl border border-[#F5ACB1]/25 bg-[#210D08]/75 px-8 py-5 font-black text-[#FFF6EF]"
              >
                Dejar opinión
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="absolute -inset-8 rounded-full bg-[#F5ACB1]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[3rem] border border-[#F5ACB1]/25 bg-[#210D08]/85 p-4 shadow-2xl shadow-black/50">
              <Image
                src="/cookies/menu-board-2.png"
                alt="Menú premium Ianis Bakery"
                width={900}
                height={1200}
                className="aspect-[4/5] w-full rounded-[2.4rem] object-cover shadow-[0_0_50px_rgba(245,172,177,0.25)]"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-[#D99B55]">
              Catálogo
            </p>

            <h2 className="mt-4 text-5xl font-black md:text-7xl">
              Sabores disponibles
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FFF6EF]/65">
              Precios iniciales sugeridos. Luego se pueden ajustar con los datos
              reales de la encuesta y el costo de producción.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {cookies.map((cookie) => (
              <article
                key={cookie.name}
                className="group overflow-hidden rounded-[2.5rem] border border-[#E6B47C]/35 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/30 transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={cookie.image}
                    alt={cookie.name}
                    width={900}
                    height={900}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-[#C95867] px-4 py-2 text-sm font-black text-white shadow-lg">
                    {cookie.tag}
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-[#120704]/85 px-4 py-2 text-sm font-black text-[#F5ACB1] shadow-lg">
                    {cookie.price}
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    {cookie.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-center gap-1 text-[#D99B55]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <p className="mt-4 min-h-20 text-sm leading-6 text-[#2A120B]/75">
                    {cookie.desc}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C95867]/25 bg-white px-5 py-3 font-black text-[#C95867]">
                      <Heart size={18} />
                      Favorito
                    </button>

                    <Link
                      href="/cart"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C95867] px-5 py-3 font-black text-white shadow-xl transition hover:bg-[#A74250]"
                    >
                      <ShoppingBag size={18} />
                      Ordenar
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[3rem] border border-[#F5ACB1]/25 bg-gradient-to-br from-[#F5ACB1] to-[#D99B55] p-8 text-[#120704] shadow-2xl shadow-[#F5ACB1]/20 md:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#120704]/12 px-4 py-2 text-sm font-black">
                <Flame size={18} />
                Caja recomendada
              </div>

              <h2 className="text-5xl font-black leading-tight md:text-6xl">
                Prueba los 6 sabores en una caja premium.
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#2A120B]/80">
                Perfecta para degustaciones, regalos o para decidir cuál será tu
                próxima cookie favorita.
              </p>
            </div>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#120704] px-8 py-5 text-lg font-black text-[#FFF6EF]"
            >
              Crear caja
              <Cookie />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
