import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, QrCode, Smartphone } from "lucide-react";

const surveyUrl = "https://ianis-bakery.vercel.app/taste";
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=900x900&data=${encodeURIComponent(
  surveyUrl
)}`;

export default function QRPage() {
  return (
    <main className="min-h-screen bg-[#0B0706] px-5 py-8 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(232,163,154,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.16),transparent_35%)]" />

      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#F2B6AD]"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={120}
              height={120}
              className="mb-6 rounded-full border border-[#E8A39A]/30 object-cover shadow-2xl shadow-[#E8A39A]/20"
              priority
            />

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8A39A]/25 bg-[#1A0D0B]/80 px-4 py-2 text-sm text-[#F2B6AD]">
              <QrCode size={16} />
              QR oficial de degustación
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-6xl">
              Escanea y deja tu opinión.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#FFF3EE]/70">
              Este código QR lleva directo a la encuesta premium de Ianis
              Bakery. Ideal para imprimir, pegar en la mesa de muestras o
              mostrar desde el teléfono.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={qrUrl}
                target="_blank"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-8 py-5 font-black text-[#0B0706]"
              >
                <Download />
                Abrir QR
              </a>

              <Link
                href="/taste"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#E8A39A]/20 bg-[#1A0D0B]/80 px-8 py-5 font-bold text-[#FFF3EE]"
              >
                <Smartphone />
                Probar encuesta
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/50">
            <div className="rounded-[2rem] bg-[#FFF3EE] p-5">
              <img
                src={qrUrl}
                alt="QR Ianis Bakery"
                className="aspect-square w-full rounded-[1.4rem]"
              />
            </div>

            <div className="mt-6 rounded-[2rem] border border-[#E8A39A]/15 bg-[#0B0706]/80 p-5 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#D8A85B]">
                Ianis Bakery
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#F2B6AD]">
                Encuesta de Degustación
              </h2>
              <p className="mt-3 break-all text-sm text-[#FFF3EE]/55">
                {surveyUrl}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
