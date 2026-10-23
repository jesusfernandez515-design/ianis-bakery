import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cookie, Gift, Heart, MapPin, MessageCircle, PackageCheck } from "lucide-react";
import HomeCatalog from "@/components/HomeCatalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ianis Bakery | Cookies gourmet en Holiday, Florida",
  description: "Cookies artesanales rellenas, sabores gourmet y cajas personalizadas de 4, 6 o 12. Ordena para recogido en Holiday, Florida.",
  alternates: { canonical: "https://www.ianisbakery.com/" },
  openGraph: { title: "Ianis Bakery · Hechas con amor", description: "Cookies gourmet rellenas hasta el centro. Solo recogido en Holiday, Florida.", url: "https://www.ianisbakery.com/", type: "website", locale: "es_US", images: [{ url: "https://www.ianisbakery.com/logo-ianis.png", alt: "Ianis Bakery" }] },
};

export default function HomePage() {
  return <div className="bakery-home">
    <section className="home-hero" aria-labelledby="hero-heading">
      <div className="home-hero-inner">
        <div className="home-hero-copy">
          <p className="brand-eyebrow"><Heart size={15} aria-hidden="true" /> HECHAS CON AMOR</p>
          <h1 id="hero-heading"><span>Cookies gourmet</span>rellenas hasta el centro.</h1>
          <p className="home-hero-description">Galletas artesanales con rellenos irresistibles. Un antojo especial, una caja para compartir o un detalle hecho con amor.</p>
          <div className="home-hero-actions"><Link className="home-primary" href="/cart">Ordenar para recogido <ArrowRight size={18} aria-hidden="true" /></Link><Link className="home-secondary" href="/box-builder">Crea tu caja <Gift size={18} aria-hidden="true" /></Link></div>
          <p className="home-pickup"><MapPin size={17} aria-hidden="true" /> Solo recogido · Holiday, Florida</p>
        </div>
        <div className="home-hero-visual">
          <div className="home-hero-photo"><Image src="/nutella.png" alt="Cookies rellenas de Nutella de Ianis Bakery" fill sizes="(max-width: 899px) 100vw, 54vw" priority className="object-cover" /></div>
          <div className="home-photo-caption"><Cookie size={22} aria-hidden="true" /><span>El amor está<br /><strong>en el centro.</strong></span><Heart size={22} aria-hidden="true" /></div>
        </div>
      </div>
    </section>
    <HomeCatalog />
    <section className="home-box-section" aria-labelledby="box-heading"><div className="home-box-inner">
      <div className="home-box-photo"><Image src="/cookie-boxes.png" alt="Cajas de cookies de Ianis Bakery" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div>
      <div className="home-box-copy"><p className="brand-eyebrow">PARA REGALAR. PARA COMPARTIR. PARA TI.</p><h2 id="box-heading">Una caja.<br /><em>Muchos motivos para sonreír.</em></h2><p>Combina tus sabores favoritos en una caja de 4, 6 o 12 cookies. Tú eliges la mezcla; nosotros ponemos el cariño.</p><Link href="/box-builder" className="home-primary">Crear mi caja <Gift size={18} aria-hidden="true" /></Link></div>
    </div></section>
    <section className="home-how" aria-labelledby="pickup-heading"><div className="home-section-inner"><div className="home-section-heading"><p className="brand-eyebrow">TU PRÓXIMO ANTOJO, MÁS CERCA</p><h2 id="pickup-heading">Del horno a tus manos</h2></div><div className="home-steps">
      <article><Cookie size={27} aria-hidden="true" /><h3>Elige tus sabores</h3><p>Agrega tus cookies favoritas o arma una caja para compartir.</p></article>
      <article><MessageCircle size={27} aria-hidden="true" /><h3>Coordina tu recogido</h3><p>Confirma el punto y horario con la panadería en Holiday, Florida.</p></article>
      <article><PackageCheck size={27} aria-hidden="true" /><h3>Recoge y disfruta</h3><p>Por el momento solo ofrecemos recogido. El pago se coordina con la panadería.</p></article>
    </div></div></section>
  </div>;
}
