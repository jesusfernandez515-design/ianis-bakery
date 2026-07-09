import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, QrCode, Smartphone } from "lucide-react";

const surveyUrl = "https://ianis-bakery.vercel.app/taste";
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&margin=24&data=${encodeURIComponent(
  surveyUrl
)}`;

export default function QRPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050202] px-5 py-7 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(242,182,173,0.22),transparent_34%),radial-gradient(circle_at_bottom,rgba(216,168,91,0.16),transparent_38%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,7,6,0.55),#050202_72%)]" />

      <div className="mx-auto max-w-[680px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-black text-[#F2B6AD]"
        >
          <ArrowLeft size={22} />
          Volver al inicio
        </Link>

        <section className="pt-8 text-center">
          <div className="relative mx-auto h-72 w-72 sm:h-96 sm:w-96">
            <div className="absolute inset-0 rounded-full bg-[#F2B6AD]/25 blur-3xl" />
            <div className="absolute inset-4 rounded-full border border-[#F2B6AD]/30 bg-[#1A0D0B]/80 shadow-2xl shadow-[#F2B6AD]/20" />

            <Image
              src="/logo-ianis.png"
              alt="Logo oficial Ianis Bakery"
              width={520}
              height={520}
              className="relative h-full w-full rounded-full border-[6px] border-[#FFF3EE]/90 object-cover shadow-[0_0_55px_rgba(242,182,173,0.45)]"
              priority
            />
          </div>

          <div className="mx-auto mt-8 inline-flex items-center justify-center gap-3 rounded-full border border-[#E8A39A]/35 bg-[#120706]/80 px-7 py-4 text-base font-black text-[#F2B6AD] shadow-xl shadow-black/40 backdrop-blur">
            <QrCode size={21} />
            QR oficial de degustación
          </div>

          <h1 className="mt-8 text-left text-5xl font-black leading-[1.04] tracking-tight text-[#FFF3EE] sm:text-center sm:text-7xl">
            Escanea y deja tu opinión.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-left text-xl leading-9 text-[#FFF3EE]/72 sm:text-center">
            Este código QR lleva directo a la encuesta premium de Ianis Bakery.
            Ideal para imprimir, pegar en la mesa de muestras o mostrar desde el
            teléfono.
          </p>

          <div className="mt-9 grid gap-4">
            <a
              href={qrUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-4 rounded-3xl bg-[#F2B6AD] px-8 py-6 text-xl font-black text-[#050202] shadow-[0_0_35px_rgba(242,182,173,0.25)] transition hover:bg-[#FFF3EE]"
            >
              <Download size={28} />
              Abrir QR
            </a>

            <Link
              href="/taste"
              className="inline-flex items-center justify-center gap-4 rounded-3xl border border-[#E8A39A]/25 bg-[#1A0D0B]/70 px-8 py-6 text-xl font-black text-[#FFF3EE] shadow-2xl shadow-black/30 backdrop-blur transition hover:border-[#F2B6AD]/60"
            >
              <Smartphone size={28} />
              Probar encuesta
            </Link>
          </div>
        </section>

        <section className="mt-9 rounded-[2.5rem] border border-[#E8A39A]/20 bg-[#1A0D0B]/72 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="rounded-[2rem] bg-[#FFF3EE] p-5 shadow-[0_0_45px_rgba(242,182,173,0.22)]">
            <img
              src={qrUrl}
              alt="Código QR de Ianis Bakery"
              className="aspect-square w-full rounded-[1.45rem]"
            />
          </div>

          <div className="-mt-1 rounded-b-[2rem] border border-[#E8A39A]/14 bg-[#080302] px-5 py-7 text-center">
            <p className="text-sm font-black uppercase tracking-[0.48em] text-[#D8A85B]">
              Ianis Bakery
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#F2B6AD]">
              Encuesta de Degustación
            </h2>

            <p className="mx-auto mt-4 max-w-md break-all text-sm leading-6 text-[#FFF3EE]/55">
              {surveyUrl}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
