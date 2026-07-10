"use client";

import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, query } from "firebase/firestore";
import {
  Gift,
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

const fallbackProducts: Product[] = [
  {
    id: "nutella",
    name: "Nutella Supreme",
    price: 4.99,
    tag: "Nueva",
    description:
      "Cookie rellena de Nutella cremosa con chispas de chocolate.",
    image: "/nutella.png",
    active: true,
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Explosion",
    price: 4.99,
    tag: "Especial",
    description:
      "Mantequilla de maní cremosa con chispas de chocolate.",
    image: "/peanut-butter.png",
    active: true,
  },
  {
    id: "double-chocolate",
    name: "Double Chocolate Lava",
    price: 4.99,
    tag: "Favorita",
    description:
      "Chocolate intenso con un irresistible centro fundido.",
    image: "/double-chocolate.png",
    active: true,
  },
  {
    id: "dulce-leche",
    name: "Dulce de Leche Dream",
    price: 4.99,
    tag: "Premium",
    description:
      "Cookie artesanal rellena de dulce de leche cremoso.",
    image: "/dulce-leche.png",
    active: true,
  },
  {
    id: "marshmallow",
    name: "Marshmallow Chocolate",
    price: 5.49,
    tag: "Especial",
    description:
      "Malvavisco suave con chocolate irresistible.",
    image: "/marshmallow.png",
    active: true,
  },
  {
    id: "coconut",
    name: "Coconut Paradise",
    price: 5.49,
    tag: "Tropical",
    description:
      "Chocolate relleno de coco cremoso y coco rallado.",
    image: "/coconut.png",
    active: true,
  },
];

export default function ShopPage() {
  const [firebaseProducts, setFirebaseProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("Todos");

  useEffect(() => {
    const productsQuery = query(collection(db, "products"));

    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const products = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Product[];

        setFirebaseProducts(
          products
            .filter((product) => product.active !== false)
            .map((product) => ({
              ...product,
              image: normalizeImagePath(product.image, product.name),
            }))
        );

        setLoading(false);
      },
      (error) => {
        console.error("Error cargando productos:", error);
        setFirebaseProducts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const products =
    firebaseProducts.length > 0 ? firebaseProducts : fallbackProducts;

  const tags = useMemo(() => {
    return [
      "Todos",
      ...Array.from(
        new Set(products.map((product) => product.tag || "Premium"))
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const content = `${product.name || ""} ${
        product.description || ""
      }`.toLowerCase();

      const matchesSearch = content.includes(search.toLowerCase());
      const matchesTag =
        selectedTag === "Todos" ||
        (product.tag || "Premium") === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [products, search, selectedTag]);

  return (
    <div className="min-h-screen bg-[#120704] px-5 py-10 text-[#FFF6EF] md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/75 px-5 py-3 text-sm font-black text-[#F5ACB1]">
              <Sparkles size={17} />
              Tienda Ianis Bakery
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[0.95] md:text-7xl">
              Ordena tus cookies favoritas.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FFF6EF]/65">
              Explora nuestros sabores, crea tu caja personalizada y prepara tu
              próximo momento dulce.
            </p>

            <Link
              href="/box-builder"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 font-black text-[#120704]"
            >
              Crear caja personalizada
              <Gift size={20} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[2.7rem] border border-[#F5ACB1]/20 bg-[#210D08] p-3">
            <Image
              src="/cookie-boxes.png"
              alt="Cajas Ianis Bakery"
              width={1536}
              height={1024}
              className="aspect-[3/2] w-full rounded-[2.2rem] object-cover"
              priority
            />
          </div>
        </header>

        <section className="mt-14 rounded-[2.3rem] border border-[#F5ACB1]/20 bg-[#210D08]/85 p-5 md:p-7">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#D99B55]">
            Catálogo
          </p>

          <h2 className="mt-3 text-4xl font-black">Productos disponibles</h2>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-5 py-4">
              <Search size={19} className="text-[#F5ACB1]" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar sabor..."
                className="w-full bg-transparent outline-none placeholder:text-[#FFF6EF]/30"
              />
            </div>

            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-5 py-4 font-black outline-none"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag} className="bg-[#120704]">
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-10">
          {loading ? (
            <div className="rounded-[2rem] border border-[#F5ACB1]/20 bg-[#210D08]/70 p-10 text-center">
              <p className="font-black text-[#F5ACB1]">
                Cargando productos...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#F5ACB1]/25 p-10 text-center">
              <h2 className="text-3xl font-black">No encontramos productos</h2>
              <p className="mt-3 text-[#FFF6EF]/55">
                Prueba con otro nombre o categoría.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-[2.3rem] border border-[#E6B47C]/30 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/25"
                >
                  <div className="relative aspect-[3/4] bg-[#EEDAC8]">
                    <Image
                      src={normalizeImagePath(product.image, product.name)}
                      alt={product.name || "Cookie Ianis Bakery"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#C95867] px-4 py-2 text-xs font-black text-white">
                        {product.tag || "Premium"}
                      </span>

                      <span className="rounded-full bg-[#120704] px-4 py-2 text-sm font-black text-[#F5ACB1]">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-black uppercase leading-tight">
                      {product.name || "Producto Ianis Bakery"}
                    </h3>

                    <div className="mt-3 flex gap-1 text-[#D99B55]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={15} fill="currentColor" />
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#2A120B]/70">
                      {product.description ||
                        "Cookie gourmet rellena hasta el centro."}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C95867]/25 px-4 py-3 font-black text-[#C95867]"
                      >
                        <Heart size={17} />
                        Favorito
                      </button>

                      <Link
                        href="/cart"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C95867] px-4 py-3 font-black text-white"
                      >
                        <ShoppingBag size={17} />
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
    </div>
  );
}

function normalizeImagePath(image?: string, productName?: string) {
  const name = (productName || "").toLowerCase();

  if (name.includes("nutella")) return "/nutella.png";
  if (name.includes("peanut")) return "/peanut-butter.png";
  if (name.includes("double") || name.includes("doble")) {
    return "/double-chocolate.png";
  }
  if (name.includes("dulce")) return "/dulce-leche.png";
  if (name.includes("marshmallow") || name.includes("malvavisco")) {
    return "/marshmallow.png";
  }
  if (name.includes("coconut") || name.includes("coco")) {
    return "/coconut.png";
  }

  if (!image) return "/nutella.png";

  let normalized = image.trim();

  normalized = normalized.replace(/^https?:\/\/[^/]+/, "");
  normalized = normalized.replace("/cookies/", "/");

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
              }
