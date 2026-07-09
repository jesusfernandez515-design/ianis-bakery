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
    name: "Nutella Supreme",
    desc: "Galleta con chispas de chocolate rellena de Nutella y cubierta con más Nutella.",
    price: "$4.99",
    image: "/cookies/menu-board.png",
  },
  {
    name: "Peanut Butter Explosion",
    desc: "Cookie suave con mantequilla de maní cremosa y chips de chocolate.",
    price: "$4.99",
    image: "/cookies/peanut-butter.png",
  },
  {
    name: "Double Chocolate Lava",
    desc: "Chocolate intenso, centro suave y relleno de chocolate fundido.",
    price: "$4.99",
    image: "/cookies/double-chocolate.png",
  },
  {
    name: "Dulce de Leche Dream",
    desc: "Dulce de leche artesanal con una mordida suave, cremosa y deliciosa.",
    price: "$4.99",
    image: "/cookies/dulce-leche.png",
  },
  {
    name: "Marshmallow Chocolate",
    desc: "Rellena de malvavisco suave y trozos de chocolate irresistibles.",
    price: "$5.49",
    image: "/cookies/marshmallow.png",
  },
  {
    name: "Coconut Paradise",
    desc: "Chocolate relleno de coco cremoso y cubierta con coco rallado premium.",
    price: "$5.49",
    image: "/cookies/coconut.png",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#120704] text-[#FFF6EF]">
      <section className="relative min-h-screen px-5 py-6 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.24),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,7,4,0.20),#120704_88%)]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={64}
                height={64}
                className="rounded-full border-2 border-[#FFF6EF]/80 object-contain shadow-[0_0_24px_rgba(245,172,177,0.45)]"
                priority
              />

              <div>
                <p className="text-lg font-black leading-none text-[#F5ACB1]">
                  Ianis Bakery
                </p>
                <p className="text-xs tracking-wide text-[#D99B55]">
                  Cookies gourmet
                </p>
              </div>
            </Link>

            <Link
              href="/cart"
              className="rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704] shadow-lg shadow-[#F5ACB1]/20 transition hover:bg-[#FFF6EF]"
            >
              Ordenar
            </Link>
          </nav>

          <div className="grid gap-12 py-14 lg:grid-cols-[1fr_560px] lg:items-center lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/75 px-5 py-3 text-sm font-black text-[#F5ACB1] backdrop-blur">
                <Sparkles size={17} />
                Frescas todos los días
              </div>

              <h1 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-tight md:text-8xl">
                Cookies gourmet rellenas hasta el centro.
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#FFF6EF]/76">
                Ianis Bakery crea galletas artesanales premium con rellenos
                cremosos, sabores intensos y una presentación hecha para
                enamorar desde la primera mordida.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/menu"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] shadow-2xl shadow-[#F5ACB1]/20 transition hover:bg-[#FFF6EF]"
                >
                  Ver menú premium
                  <ArrowRight className="transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/taste"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#F5ACB1]/25 bg-[#210D08]/75 px-8 py-5 font-black text-[#FFF6EF] backdrop-blur transition hover:bg-[#35160F]"
                >
                  Dejar opinión
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                <Stat value="100%" label="Artesanal" />
                <Stat value="6" label="Sabores" />
                <Stat value="QR" label="Encuesta" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute -inset-10 rounded-full bg-[#F5ACB1]/20 blur-3xl" />
              <div className="absolute -right-8 -top-8 hidden rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/85 px-7 py-5 text-center shadow-2xl backdrop-blur md:block">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#D99B55]">
                  Nueva
                </p>
                <p className="text-xl font-black text-[#F5ACB1]">
                  Doble Chocolate
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[3rem] border border-[#F5ACB1]/25 bg-[#210D08]/85 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
                <Image
                  src="/cookies/double-chocolate.png"
                  alt="Cookie doble chocolate Ianis Bakery"
                  width={900}
                  height={1200}
                  className="aspect-[4/5] w-full rounded-[2.4rem] object-cover object-center shadow-[0_0_50px_rgba(245,172,177,0.28)]"
                  priority
                />

                <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border border-[#F5ACB1]/20 bg-[#120704]/82 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-[#D99B55]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} fill="currentColor" size={20} />
                    ))}
                  </div>

                  <p className="mt-3 text-lg font-black text-[#FFF6EF]">
                    “Pura tentación en cada bocado.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sabores" className="px-5 py-18 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-[#D99B55]">
              Nuestros sabores
            </p>

            <h2 className="mt-4 text-5xl font-black md:text-7xl">
              Menú gourmet
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FFF6EF]/65">
              Sabores diseñados para vender, regalar y crear una experiencia
              dulce con apariencia premium.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {flavors.map((flavor) => (
              <article
                key={flavor.name}
                className="group overflow-hidden rounded-[2.5rem] border border-[#E6B47C]/35 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/30 transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    width={900}
                    height={900}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-[#C95867] px-4 py-2 text-sm font-black text-white shadow-lg">
                    {flavor.price}
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    {flavor.name}
                  </h3>

                  <p className="mt-3 min-h-16 text-sm leading-6 text-[#2A120B]/75">
                    {flavor.desc}
                  </p>

                  <Link
                    href="/cart"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#C95867] px-6 py-3 font-black text-white shadow-xl transition hover:bg-[#A74250]"
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

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <Feature
            icon={<Heart />}
            title="Hechas con amor"
            desc="Cada cookie está pensada para sentirse especial desde la primera mordida."
          />
          <Feature
            icon={<BadgeCheck />}
            title="Cookies gourmet"
            desc="Sabores intensos, rellenos cremosos y presentación lista para vender."
          />
          <Feature
            icon={<Gift />}
            title="Listas para regalar"
            desc="Perfectas para cajas, degustaciones, detalles y pedidos especiales."
          />
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[3rem] border border-[#F5ACB1]/25 bg-[#210D08]/88 p-6 shadow-2xl shadow-black/40 md:p-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-[#D99B55]">
              Caja degustación
            </p>

            <h2 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              Prueba los 6 sabores y elige tu favorito.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#FFF6EF]/70">
              Una caja perfecta para validar sabores, compartir con familia o
              regalar una experiencia dulce premium.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704]"
              >
                Ordenar caja
                <ArrowRight />
              </Link>

              <Link
                href="/qr"
                className="inline-flex items-center justify-center rounded-2xl border border-[#F5ACB1]/25 bg-[#120704]/70 px-8 py-5 font-black text-[#FFF6EF]"
              >
                Compartir QR
              </Link>
            </div>
          </div>

          <Image
            src="/cookies/menu-board-2.png"
            alt="Menú premium Ianis Bakery"
            width={900}
            height={1200}
            className="aspect-[4/5] w-full rounded-[2.3rem] object-cover shadow-2xl"
          />
        </div>
      </section>

      <footer className="border-t border-[#F5ACB1]/10 px-5 py-10 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={56}
              height={56}
              className="rounded-full border border-[#FFF6EF]/70 object-contain"
            />

            <div>
              <p className="font-black text-[#F5ACB1]">Ianis Bakery</p>
              <p className="text-sm text-[#FFF6EF]/55">
                Cookies gourmet · Rellenas hasta el centro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#F5ACB1]">
            <span className="text-xl">📸</span>
            <span className="font-bold">Instagram @ianis_bakery</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#F5ACB1]/15 bg-[#210D08]/70 p-4 backdrop-blur">
      <p className="text-2xl font-black text-[#F5ACB1]">{value}</p>
      <p className="mt-1 text-xs text-[#FFF6EF]/55">{label}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#F5ACB1]/15 bg-[#210D08]/80 p-7 shadow-xl shadow-black/20">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5ACB1] text-[#120704]">
        {icon}
      </div>

      <h3 className="text-2xl font-black text-[#F5ACB1]">{title}</h3>

      <p className="mt-3 leading-7 text-[#FFF6EF]/65">{desc}</p>
    </div>
  );
}
