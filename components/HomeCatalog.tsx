"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCatalog } from "@/lib/use-catalog";
import type { CatalogProduct } from "@/lib/catalog";

export default function HomeCatalog() {
  const { products, loading } = useCatalog();
  const [notice, setNotice] = useState("");
  function addToCart(event: React.MouseEvent<HTMLAnchorElement>, product: CatalogProduct) {
    try {
      const saved = JSON.parse(localStorage.getItem("ianis-bakery-cart") || "[]");
      const cart = Array.isArray(saved) ? saved : [];
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        existing.qty = Math.min(Math.max(1, Math.floor(Number(existing.qty) || 0)) + 1, 100);
        existing.price = product.price;
        existing.name = product.name;
      } else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
      localStorage.setItem("ianis-bakery-cart", JSON.stringify(cart));
    } catch {
      event.preventDefault();
      setNotice("No pudimos guardar el producto. Permite el almacenamiento del navegador o agrega tus cookies desde el carrito.");
    }
  }
  return <section className="home-menu" id="sabores" aria-labelledby="flavors-heading">
    <div className="home-section-inner">
      <div className="home-section-heading">
        <p className="brand-eyebrow">UN POQUITO DE FELICIDAD</p>
        <h2 id="flavors-heading">Elige tu favorita</h2>
        <p>Por fuera, irresistibles. Por dentro, llenas de sabor.</p>
      </div>
      {notice && <p role="alert" className="home-notice">{notice} <Link href="/cart">Ir al carrito</Link></p>}
      {products.length === 0 ? <p className="home-empty">Estamos preparando el próximo menú. Consulta la disponibilidad con la panadería.</p> :
        <div className="home-products">{products.map(product => <article className="home-product" key={product.id}>
          <div className="home-product-image"><Image src={product.image || "/logo-ianis.png"} alt={product.name} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" />{product.tag && <span className="home-product-tag">{product.tag}</span>}</div>
          <div className="home-product-content"><h3>{product.name}</h3><p className="home-product-description">{product.description || "Cookie gourmet rellena hasta el centro."}</p><div className="home-product-bottom"><p className="home-product-price">${product.price.toFixed(2)}</p><Link href="/cart" onClick={event => addToCart(event, product)} aria-label={`Agregar ${product.name} al carrito`} className="home-add">Agregar <ShoppingBag size={16} aria-hidden="true" /></Link></div></div>
        </article>)}</div>}
      <div className="home-menu-footer"><Link href="/shop" className="home-text-link">{loading ? "Explorar la tienda" : "Ver todos los sabores y favoritos"} <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </div>
  </section>;
}
