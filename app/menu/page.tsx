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
    price: "$3.50",
    tag: "Más pedido",
    desc: "Cookie gourmet con centro cremoso de Nutella y textura suave.",
    emoji: "🍫",
  },
  {
    name: "Double Chocolate Lava",
    price: "$3.75",
    tag: "Chocolate lover",
    desc: "Chocolate intenso con centro suave estilo lava.",
    emoji: "🍪",
  },
  {
    name: "Dulce de Leche Dream",
    price: "$3.50",
    tag: "Premium",
    desc: "Dulce de leche artesanal con sabor elegante y balanceado.",
    emoji: "🍯",
  },
  {
    name: "Peanut Butter Explosion",
    price: "$3.50",
    tag: "Nuevo",
    desc: "Mantequilla de maní cremosa con un toque dulce perfecto.",
    emoji: "🥜",
  },
  {
    name: "Marshmallow Chocolate",
    price: "$3.75",
    tag: "Sweet",
    desc: "Chocolate con marshmallow suave para una mordida especial.",
    emoji: "☁️",
  },
  {
    name: "Coconut Paradise",
    price: "$3.50",
    tag: "Tropical",
    desc: "Coco dulce con textura gourmet y sabor caribeño.",
    emoji: "🥥",
  },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050202] px-5 py-7 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(242,182,173,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.16),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#E8A39A]/20 bg-[#120706]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-[#F2B6AD]"
          >
            <ArrowLeft size={18} />
            Inicio
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={54}
              height={54}
              className="rounded-full border border-[#FFF3EE]/70 object-contain"
              priority
            />
            <span className="hidden font-black text-[#F2B6AD] sm:inline">
              Ianis Bakery
            </span>
          </Link>

          <Link
            href="/taste"
            className="rounded-full bg-[#F2B6AD] px-4 py-3 text-sm font-black text-[#050202]"
          >
            Opinión
          </Link>
        </nav>

        <section className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8A39A]/25 bg-[#1A0D0B]/80 px-5 py-3 text-sm font-black text-[#F2B6AD]">
              <Sparkles size={17} />
              Menú gourmet premium
            </div>

            <h1 className="text-5xl font-black leading-[1.02] md:text-7xl">
              Cookies rellenas hasta el centro.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF3EE]/70">
              Sabores artesanales creados para vender, regalar y conquistar
              desde la primera mordida. Este menú puede crecer luego con pedidos
              online y pagos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/taste"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-8 py-5 text-lg font-black text-[#050202]"
              >
                Probar y opinar
                <ArrowRight />
              </Link>

              <Link
                href="/qr"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#E8A39A]/20 bg-[#1A0D0B]/80 px-8 py-5 font-black text-[#FFF3EE]"
              >
                Ver QR
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute -inset-8 rounded-full bg-[#F2B6AD]/20 blur-3xl" />
            <div className="relative rounded-[3rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/80 p-5 shadow-2xl shadow-black/50">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={520}
                height={520}
                className="aspect-square w-full rounded-[2.2rem] object-contain bg-[#050202] shadow-[0_0_45px_rgba(242,182,173,0.32)]"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#D8A85B]">
                Catálogo
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Sabores disponibles
              </h2>
            </div>

            <p className="max-w-xl text-[#FFF3EE]/60">
              Precios iniciales sugeridos. Luego se pueden ajustar con los datos
              reales de la encuesta.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cookies.map((cookie) => (
              <article
                key={cookie.name}
                className="group overflow-hidden rounded-[2.3rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/88 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-[#F2B6AD]/40"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2B6AD] via-[#D8A85B] to-[#2A1713]">
                  <div className="absolute right-4 top-4 rounded-full bg-[#050202]/80 px-4 py-2 text-sm font-black text-[#F2B6AD]">
                    {cookie.tag}
                  </div>

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,243,238,0.35),transparent_42%)]" />

                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#FFF3EE]/30 bg-[#050202]/40 text-7xl shadow-2xl backdrop-blur">
                    {cookie.emoji}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-[#F2B6AD]">
                        {cookie.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-1 text-[#D8A85B]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={15} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <p className="rounded-full bg-[#F2B6AD] px-4 py-2 text-lg font-black text-[#050202]">
                      {cookie.price}
                    </p>
                  </div>

                  <p className="min-h-16 leading-7 text-[#FFF3EE]/65">
                    {cookie.desc}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E8A39A]/20 bg-[#050202]/70 px-4 py-4 font-black text-[#F2B6AD]">
                      <Heart size={18} />
                      Favorito
                    </button>

                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F2B6AD] px-4 py-4 font-black text-[#050202]">
                      <ShoppingBag size={18} />
                      Ordenar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2.5rem] border border-[#E8A39A]/25 bg-gradient-to-br from-[#F2B6AD] to-[#D8A85B] p-8 text-[#050202] shadow-2xl shadow-[#E8A39A]/20 md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#050202]/12 px-4 py-2 text-sm font-black">
                <Flame size={18} />
                Próximo paso
              </div>

              <h2 className="text-4xl font-black md:text-5xl">
                Activar pedidos por WhatsApp.
              </h2>

              <p className="mt-4 max-w-2xl text-lg text-[#2A1713]/80">
                Podemos conectar cada botón de ordenar a un mensaje directo de
                WhatsApp con el sabor, cantidad y nombre del cliente.
              </p>
            </div>

            <Link
              href="/taste"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#050202] px-8 py-5 text-lg font-black text-[#FFF3EE]"
            >
              Validar sabores
              <Cookie />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
