"use client";

import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  ArrowLeft,
  Cookie,
  Heart,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";

type Product = {
  id: string;
  name?: string;
  price?: number;
  tag?: string;
  description?: string;
  image?: string;
  active?: boolean;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("Todos");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(data.filter((product) => product.active !== false));
    });

    return () => unsubscribe();
  }, []);

  const tags = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((product) => product.tag || "Premium"))
    );

    return ["Todos", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name || ""} ${product.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTag = tag === "Todos" || (product.tag || "Premium") === tag;

      return matchesSearch && matchesTag;
    });
  }, [products, search, tag]);

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-7 text-[#FFF6EF]">
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
            Carrito
          </Link>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_480px] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <Sparkles size={17} />
              Tienda dinámica Firebase
            </div>

            <h1 className="text-6xl font-black leading-[0.93] md:text-8xl">
              Ordena tus cookies favoritas.
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-9 text-[#FFF6EF]/70">
              Esta tienda se alimenta directamente del catálogo administrativo.
              Si agregas, editas o desactivas productos en Firebase, aquí se
              actualizan automáticamente.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/box-builder"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704]"
              >
                Crear caja personalizada
                <ShoppingBag />
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
                alt="Tienda Ianis Bakery"
                width={900}
                height={1200}
                className="aspect-[4/5] w-full rounded-[2.4rem] object-cover shadow-[0_0_50px_rgba(245,172,177,0.25)]"
                priority
              />
            </div>
          </div>
        </header>

        <section className="mt-12 rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#D99B55]">
                Catálogo
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Productos disponibles
              </h2>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex items-center gap-2 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-4 py-3">
                <Search size={18} className="text-[#F5ACB1]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar sabor..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#FFF6EF]/35 md:w-72"
                />
              </div>

              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-4 py-3 text-sm font-bold text-[#FFF6EF] outline-none"
              >
                {tags.map((item) => (
                  <option key={item} value={item} className="bg-[#120704]">
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#F5ACB1]/25 bg-[#210D08]/70 p-10 text-center">
              <Cookie className="mx-auto mb-4 text-[#F5ACB1]" size={48} />
              <h2 className="text-3xl font-black">No hay productos</h2>
              <p className="mt-2 text-[#FFF6EF]/55">
                Agrega productos desde el panel de catálogo.
              </p>

              <Link
                href="/admin/catalog"
                className="mt-6 inline-flex rounded-2xl bg-[#F5ACB1] px-6 py-4 font-black text-[#120704]"
              >
                Ir al catálogo
              </Link>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[2.5rem] border border-[#E6B47C]/35 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/30 transition hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image || "/cookies/double-chocolate.png"}
                      alt={product.name || "Ianis Bakery cookie"}
                      width={900}
                      height={900}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-[#C95867] px-4 py-2 text-sm font-black text-white shadow-lg">
                      {product.tag || "Premium"}
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-[#120704]/85 px-4 py-2 text-sm font-black text-[#F5ACB1] shadow-lg">
                      ${Number(product.price || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      {product.name || "Producto sin nombre"}
                    </h3>

                    <div className="mt-3 flex items-center justify-center gap-1 text-[#D99B55]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="currentColor" />
                      ))}
                    </div>

                    <p className="mt-4 min-h-20 text-sm leading-6 text-[#2A120B]/75">
                      {product.description || "Cookie gourmet Ianis Bakery."}
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
          )}
        </section>
      </div>
    </main>
  );
}
