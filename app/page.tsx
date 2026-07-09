import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Cookie,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

const flavors = [
  {
    name: "Nutella Supreme",
    desc: "Chocolate, crema suave y textura irresistible.",
  },
  {
    name: "Double Chocolate Lava",
    desc: "Intensa, cremosa y perfecta para amantes del chocolate.",
  },
  {
    name: "Dulce de Leche Dream",
    desc: "Dulce, suave y con sabor artesanal premium.",
  },
  {
    name: "Peanut Butter Explosion",
    desc: "Mantequilla de maní con un toque dulce perfecto.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#120805] text-white">
      <section className="relative px-5 py-8 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(120,53,15,0.45),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-300 text-[#120805]">
                <Cookie size={24} />
              </div>
              <div>
                <p className="text-lg font-black leading-none">Ianis Bakery</p>
                <p className="text-xs text-amber-100/60">
                  Freshly baked with love
                </p>
              </div>
            </Link>

            <Link
              href="/taste"
              className="hidden rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-[#120805] shadow-lg shadow-amber-950/40 sm:inline-flex"
            >
              Dar opinión
            </Link>
          </nav>

          <div className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/10 px-4 py-2 text-sm text-amber-100">
                <Sparkles size={16} />
                Galletas artesanales premium
              </div>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                La próxima galleta favorita comienza con tu opinión.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-amber-100/75">
                Ianis Bakery está creando galletas artesanales con sabores
                intensos, textura suave y una experiencia premium desde la
                primera mordida.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/taste"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-300 px-8 py-5 text-lg font-black text-[#120805] shadow-2xl shadow-amber-950/40 transition hover:bg-amber-200"
                >
                  Probar y dejar mi opinión
                  <ArrowRight className="transition group-hover:translate-x-1" />
                </Link>

                <a
                  href="#sabores"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-8 py-5 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Ver sabores
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                <Stat value="100%" label="Artesanal" />
                <Stat value="QR" label="Encuesta rápida" />
                <Stat value="Premium" label="Experiencia" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-amber-300/20 blur-3xl" />
              <div className="relative rounded-[3rem] border border-amber-200/20 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <div className="rounded-[2.4rem] bg-gradient-to-br from-amber-200 via-orange-400 to-[#4a1f0d] p-8">
                  <div className="flex aspect-square items-center justify-center rounded-full bg-[#5b2a12] text-[9rem] shadow-2xl md:text-[12rem]">
                    🍪
                  </div>
                </div>

                <div className="mt-5 rounded-[2rem] border border-white/10 bg-[#120805]/70 p-5">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Star fill="currentColor" size={20} />
                    <Star fill="currentColor" size={20} />
                    <Star fill="currentColor" size={20} />
                    <Star fill="currentColor" size={20} />
                    <Star fill="currentColor" size={20} />
                  </div>
                  <p className="mt-3 font-bold">
                    “La meta es crear una galleta que la gente recuerde y quiera
                    volver a comprar.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sabores" className="relative px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
                Menú inicial
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Sabores destacados
              </h2>
            </div>
            <p className="max-w-xl text-amber-100/70">
              Cada muestra ayuda a decidir cuáles sabores se quedan, cuáles se
              mejoran y cuál será el precio ideal de lanzamiento.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {flavors.map((flavor) => (
              <div
                key={flavor.name}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 transition hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-[#120805]">
                  <Cookie />
                </div>
                <h3 className="text-xl font-black">{flavor.name}</h3>
                <p className="mt-3 text-sm leading-6 text-amber-100/65">
                  {flavor.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <Feature
            icon={<Heart />}
            title="Hechas con amor"
            desc="Cada galleta busca sentirse casera, especial y memorable."
          />
          <Feature
            icon={<BadgeCheck />}
            title="Opiniones reales"
            desc="Las respuestas ayudan a mejorar el producto antes del lanzamiento."
          />
          <Feature
            icon={<Sparkles />}
            title="Marca premium"
            desc="Diseño, sabor y presentación pensados para vender mejor."
          />
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-amber-200/20 bg-amber-300 p-8 text-[#120805] shadow-2xl md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.3em]">
            Degustación activa
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-6xl">
            ¿Probaste una galleta de Ianis Bakery?
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-[#3a1c0d]/80">
            Contesta la encuesta en menos de dos minutos y ayuda a definir los
            sabores, precios y presentación de lanzamiento.
          </p>

          <Link
            href="/taste"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#120805] px-8 py-5 text-lg font-black text-white"
          >
            Contestar encuesta
            <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-2xl font-black text-amber-300">{value}</p>
      <p className="mt-1 text-xs text-amber-100/60">{label}</p>
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
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-7">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-[#120805]">
        {icon}
      </div>
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-amber-100/65">{desc}</p>
    </div>
  );
}
