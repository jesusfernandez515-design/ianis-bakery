import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Cookie,
  Gift,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

const flavors = [
  {
    name: "Nutella Supreme",
    desc: "Galleta gourmet rellena con Nutella cremosa hasta el centro.",
  },
  {
    name: "Double Chocolate Lava",
    desc: "Chocolate intenso, centro suave y textura de brownie premium.",
  },
  {
    name: "Dulce de Leche Dream",
    desc: "Dulce de leche artesanal con una mordida suave y elegante.",
  },
  {
    name: "Peanut Butter Explosion",
    desc: "Mantequilla de maní cremosa con balance perfecto de dulzura.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0706] text-[#FFF3EE]">
      <section className="relative px-5 py-6 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,163,154,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.18),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-full border border-[#E8A39A]/20 bg-[#1A0D0B]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={56}
                height={56}
                className="rounded-full border border-[#E8A39A]/30 object-cover"
                priority
              />

              <div>
                <p className="text-lg font-black leading-none text-[#F2B6AD]">
                  Ianis Bakery
                </p>
                <p className="text-xs tracking-wide text-[#D8A85B]">
                  Cookies gourmet
                </p>
              </div>
            </Link>

            <Link
              href="/taste"
              className="rounded-full bg-[#F2B6AD] px-5 py-3 text-sm font-black text-[#0B0706] shadow-lg shadow-[#E8A39A]/20 transition hover:bg-[#FFF3EE]"
            >
              Dar opinión
            </Link>
          </nav>

          <div className="grid gap-12 py-14 md:grid-cols-2 md:items-center md:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8A39A]/25 bg-[#1A0D0B]/70 px-4 py-2 text-sm text-[#F2B6AD] backdrop-blur">
                <Sparkles size={16} />
                Rellenas hasta el centro
              </div>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-[#FFF3EE] md:text-7xl">
                Cookies gourmet hechas con amor.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#FFF3EE]/75">
                Ianis Bakery crea galletas artesanales premium con sabores
                intensos, textura suave y rellenos que llegan hasta el centro.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/taste"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-8 py-5 text-lg font-black text-[#0B0706] shadow-2xl shadow-[#E8A39A]/20 transition hover:bg-[#FFF3EE]"
                >
                  Probar y dejar mi opinión
                  <ArrowRight className="transition group-hover:translate-x-1" />
                </Link>

                <a
                  href="#sabores"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#E8A39A]/20 bg-[#1A0D0B]/70 px-8 py-5 font-bold text-[#FFF3EE] backdrop-blur transition hover:bg-[#2A1713]"
                >
                  Ver sabores
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                <Stat value="100%" label="Artesanal" />
                <Stat value="Gourmet" label="Calidad" />
                <Stat value="QR" label="Encuesta" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-[#E8A39A]/20 blur-3xl" />

              <div className="relative rounded-[3rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
                <div className="rounded-[2.4rem] bg-gradient-to-br from-[#F2B6AD] via-[#D8A85B] to-[#2A1713] p-4">
                  <div className="rounded-[2rem] bg-[#0B0706] p-4">
                    <Image
                      src="/logo-ianis.png"
                      alt="Logo oficial de Ianis Bakery"
                      width={720}
                      height={720}
                      className="aspect-square w-full rounded-[1.6rem] object-cover shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-[2rem] border border-[#E8A39A]/20 bg-[#0B0706]/80 p-5">
                  <div className="flex items-center gap-2 text-[#D8A85B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} fill="currentColor" size={20} />
                    ))}
                  </div>

                  <p className="mt-3 font-bold text-[#FFF3EE]">
                    “Una marca dulce, elegante y hecha para crear momentos
                    especiales.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sabores" className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[#D8A85B]">
            Menú inicial
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Sabores destacados
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {flavors.map((flavor) => (
              <div
                key={flavor.name}
                className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/80 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#F2B6AD]/40"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2B6AD] text-[#0B0706]">
                  <Cookie />
                </div>

                <h3 className="text-xl font-black text-[#F2B6AD]">
                  {flavor.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#FFF3EE]/65">
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
            desc="Cada galleta está pensada para sentirse especial desde la primera mordida."
          />
          <Feature
            icon={<BadgeCheck />}
            title="Cookies gourmet"
            desc="Sabores intensos, presentación premium y rellenos hasta el centro."
          />
          <Feature
            icon={<Gift />}
            title="Listas para regalar"
            desc="Una experiencia dulce ideal para muestras, pedidos y detalles especiales."
          />
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-[#E8A39A]/25 bg-gradient-to-br from-[#F2B6AD] to-[#D8A85B] p-8 text-[#0B0706] shadow-2xl shadow-[#E8A39A]/20 md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.3em]">
            Degustación activa
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-6xl">
            ¿Probaste una galleta de Ianis Bakery?
          </h2>

          <p className="mt-5 max-w-2xl text-lg text-[#2A1713]/80">
            Contesta la encuesta en menos de dos minutos y ayuda a definir los
            sabores, precios y presentación oficial.
          </p>

          <Link
            href="/taste"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#0B0706] px-8 py-5 text-lg font-black text-[#FFF3EE]"
          >
            Contestar encuesta
            <ArrowRight />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E8A39A]/10 px-5 py-10 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />

            <div>
              <p className="font-black text-[#F2B6AD]">Ianis Bakery</p>
              <p className="text-sm text-[#FFF3EE]/55">
                Cookies gourmet · Rellenas hasta el centro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#F2B6AD]">
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
    <div className="rounded-2xl border border-[#E8A39A]/15 bg-[#1A0D0B]/70 p-4 backdrop-blur">
      <p className="text-xl font-black text-[#F2B6AD]">{value}</p>
      <p className="mt-1 text-xs text-[#FFF3EE]/55">{label}</p>
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
    <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/80 p-7 shadow-xl shadow-black/20">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2B6AD] text-[#0B0706]">
        {icon}
      </div>

      <h3 className="text-2xl font-black text-[#F2B6AD]">{title}</h3>

      <p className="mt-3 leading-7 text-[#FFF3EE]/65">{desc}</p>
    </div>
  );
}
