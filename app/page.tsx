import Link from "next/link";

const flavors = [
  "Nutella Supreme",
  "Double Chocolate Lava",
  "Dulce de Leche Dream",
  "Peanut Butter Explosion",
  "Marshmallow Chocolate",
  "Coconut Paradise",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#160b07] text-white">
      <section className="relative overflow-hidden px-6 py-10 md:px-16 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#8b4513_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#f3b35b_0%,transparent_25%)] opacity-40" />

        <div className="relative mx-auto max-w-6xl">
          <nav className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
                Premium Cookies
              </p>
              <h1 className="text-2xl font-black">Ianis Bakery</h1>
            </div>

            <Link
              href="/taste"
              className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-[#160b07]"
            >
              Dar opinión
            </Link>
          </nav>

          <div className="grid gap-10 py-20 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-amber-300/30 bg-white/10 px-4 py-2 text-sm text-amber-100">
                🍪 Freshly baked with love
              </p>

              <h2 className="text-5xl font-black leading-tight md:text-7xl">
                Galletas artesanales hechas para enamorar.
              </h2>

              <p className="mt-6 max-w-xl text-lg text-amber-100/80">
                Prueba nuestros sabores, comparte tu opinión y ayúdanos a crear
                la próxima galleta favorita de Puerto Rico.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/taste"
                  className="rounded-2xl bg-amber-300 px-8 py-4 text-center font-black text-[#160b07] shadow-2xl shadow-amber-900/30"
                >
                  Probar y dejar mi opinión
                </Link>

                <a
                  href="#sabores"
                  className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-center font-bold text-white"
                >
                  Ver sabores
                </a>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-amber-200/20 bg-white/10 p-6 shadow-2xl">
              <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-amber-200 via-orange-400 to-[#3b160c] p-8">
                <div className="flex h-full items-center justify-center rounded-full bg-[#5b2a12] text-[9rem] shadow-2xl">
                  🍪
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">6</p>
                  <p className="text-xs text-amber-100/70">Sabores</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">100%</p>
                  <p className="text-xs text-amber-100/70">Artesanal</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">QR</p>
                  <p className="text-xs text-amber-100/70">Encuesta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sabores" className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
            Menú inicial
          </p>
          <h2 className="mt-3 text-4xl font-black">Sabores destacados</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {flavors.map((flavor) => (
              <div
                key={flavor}
                className="rounded-3xl border border-white/10 bg-white/[0.07] p-6"
              >
                <div className="mb-4 text-4xl">🍪</div>
                <h3 className="text-xl font-black">{flavor}</h3>
                <p className="mt-3 text-sm text-amber-100/70">
                  Una galleta premium con textura suave, sabor intenso y una
                  presentación lista para conquistar clientes.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-amber-200/20 bg-amber-300 p-8 text-[#160b07] md:p-12">
          <h2 className="text-4xl font-black">¿Probaste una galleta?</h2>
          <p className="mt-4 max-w-2xl text-lg">
            Tu opinión ayuda a Ianis Bakery a mejorar sabor, textura,
            presentación, precio y nuevos sabores antes del lanzamiento.
          </p>

          <Link
            href="/taste"
            className="mt-8 inline-flex rounded-2xl bg-[#160b07] px-8 py-4 font-black text-white"
          >
            Contestar encuesta
          </Link>
        </div>
      </section>
    </main>
  );
}
