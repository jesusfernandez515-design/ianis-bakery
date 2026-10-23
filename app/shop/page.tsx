"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  Check,
  Gift,
  Heart,
  Loader2,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/lib/use-catalog";
import { auth, db } from "@/lib/firebase";

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
  const router = useRouter();

  const { products, loading: loadingProducts } = useCatalog();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState("");

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("Todos");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
      setFavoriteIds([]);
      setLoadingFavorites(Boolean(currentUser));

      if (!currentUser) {
        setFavoriteIds([]);
        setLoadingFavorites(false);
      }
    });

    return unsubscribe;
  }, []);


  useEffect(() => {
    if (!user) return;

    const customerReference = doc(db, "customers", user.uid);

    const unsubscribe = onSnapshot(
      customerReference,
      (snapshot) => {
        const data = snapshot.data();

        setFavoriteIds(
          Array.isArray(data?.favorites)
            ? data.favorites.filter(
                (favoriteId): favoriteId is string =>
                  typeof favoriteId === "string"
              )
            : []
        );

        setLoadingFavorites(false);
      },
      (error) => {
        console.error("Error cargando favoritos:", error);
        setFavoriteIds([]);
        setLoadingFavorites(false);
      }
    );

    return unsubscribe;
  }, [user]);


  const tags = useMemo(() => {
    return [
      "Todos",
      ...Array.from(
        new Set(products.map((product) => product.tag || "Premium"))
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const content = `${product.name || ""} ${
        product.description || ""
      }`.toLowerCase();

      const matchesSearch = content.includes(normalizedSearch);

      const matchesTag =
        selectedTag === "Todos" ||
        (product.tag || "Premium") === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [products, search, selectedTag]);

  const toggleFavorite = async (product: Product) => {
    if (loadingUser || loadingFavorites) return;

    if (!user) {
      setMessage(
        "Debes iniciar sesión para guardar productos en tus favoritos."
      );

      window.setTimeout(() => {
        router.push("/account");
      }, 900);

      return;
    }

    if (updatingFavoriteId) return;

    setUpdatingFavoriteId(product.id);
    setMessage("");

    const isFavorite = favoriteIds.includes(product.id);
    const customerReference = doc(db, "customers", user.uid);

    try {
      await setDoc(
        customerReference,
        {
          uid: user.uid,
          email: user.email || "",
          favorites: isFavorite
            ? arrayRemove(product.id)
            : arrayUnion(product.id),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage(
        isFavorite
          ? `${product.name || "Producto"} fue eliminado de tus favoritos.`
          : `${product.name || "Producto"} fue guardado en tus favoritos.`
      );
    } catch (error) {
      console.error("Error actualizando favorito:", error);

      setMessage(
        "No se pudo actualizar el favorito. Verifica tu conexión e inténtalo nuevamente."
      );
    } finally {
      setUpdatingFavoriteId("");

      window.setTimeout(() => {
        setMessage("");
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] px-5 py-10 text-[#F1E2DC] md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D98478]/25 bg-[#171313]/75 px-5 py-3 text-sm font-black text-[#D98478]">
              <Sparkles size={17} />
              Tienda Ianis Bakery
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[0.95] md:text-7xl">
              Ordena tus cookies favoritas.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#F1E2DC]/65">
              Explora nuestros sabores, guarda tus favoritos y crea tu próxima
              caja personalizada.
            </p>

            <Link
              href="/box-builder"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#D98478] px-8 py-5 font-black text-[#0C0C0C]"
            >
              Crear caja personalizada
              <Gift size={20} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[2.7rem] border border-[#D98478]/20 bg-[#171313] p-3">
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

        {message && (
          <div className="sticky top-28 z-40 mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-[#D98478]/25 bg-[#171313]/95 px-5 py-4 text-center font-bold text-[#D98478] shadow-2xl backdrop-blur-xl">
            <Check size={19} />
            {message}
          </div>
        )}

        <section className="mt-14 rounded-[2.3rem] border border-[#D98478]/20 bg-[#171313]/85 p-5 md:p-7">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#B88B61]">
            Catálogo
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black">Productos disponibles</h2>

              {user && (
                <p className="mt-2 text-sm text-[#F1E2DC]/55">
                  Tienes {favoriteIds.length}{" "}
                  {favoriteIds.length === 1
                    ? "producto favorito"
                    : "productos favoritos"}
                  .
                </p>
              )}
            </div>

            {!loadingUser && !user && (
              <Link
                href="/account"
                className="font-black text-[#D98478] underline underline-offset-4"
              >
                Inicia sesión para guardar favoritos
              </Link>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#D98478]/20 bg-[#0C0C0C]/70 px-5 py-4">
              <Search size={19} className="text-[#D98478]" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar sabor..."
                className="w-full bg-transparent outline-none placeholder:text-[#F1E2DC]/30"
              />
            </div>

            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="rounded-2xl border border-[#D98478]/20 bg-[#0C0C0C]/70 px-5 py-4 font-black outline-none"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag} className="bg-[#0C0C0C]">
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-10">
          {loadingProducts ? (
            <div className="rounded-[2rem] border border-[#D98478]/20 bg-[#171313]/70 p-10 text-center">
              <Loader2 className="mx-auto animate-spin text-[#D98478]" />

              <p className="mt-4 font-black text-[#D98478]">
                Cargando productos...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#D98478]/25 p-10 text-center">
              <h2 className="text-3xl font-black">No encontramos productos</h2>

              <p className="mt-3 text-[#F1E2DC]/55">
                Prueba con otro nombre o categoría.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const isFavorite = favoriteIds.includes(product.id);
                const isUpdating = updatingFavoriteId === product.id;

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[2.3rem] border border-[#B88B61]/30 bg-[#F1E2DC] text-[#291E1B] shadow-2xl shadow-black/25"
                  >
                    <div className="relative aspect-[3/4] bg-[#E5CFC4]">
                      <Image
                        src={normalizeImagePath(
                          product.image,
                          product.name
                        )}
                        alt={product.name || "Cookie Ianis Bakery"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#A84355] px-4 py-2 text-xs font-black text-white">
                          {product.tag || "Premium"}
                        </span>

                        <span className="rounded-full bg-[#0C0C0C] px-4 py-2 text-sm font-black text-[#D98478]">
                          ${Number(product.price || 0).toFixed(2)}
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-black uppercase leading-tight">
                        {product.name || "Producto Ianis Bakery"}
                      </h3>



                      <p className="mt-4 min-h-[48px] text-sm leading-6 text-[#291E1B]/70">
                        {product.description ||
                          "Cookie gourmet rellena hasta el centro."}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(product)}
                          disabled={
                            loadingUser ||
                            loadingFavorites ||
                            Boolean(updatingFavoriteId)
                          }
                          aria-pressed={isFavorite}
                          className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isFavorite
                              ? "border-[#A84355] bg-[#A84355] text-white"
                              : "border-[#A84355]/30 bg-transparent text-[#A84355]"
                          }`}
                        >
                          {isUpdating ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Heart
                              size={17}
                              fill={isFavorite ? "currentColor" : "none"}
                            />
                          )}

                          {isFavorite ? "Guardado" : "Favorito"}
                        </button>

                        <Link
                          href="/cart"
                          onClick={(event) => {
                            try {
                              const raw = JSON.parse(localStorage.getItem("ianis-bakery-cart") || "[]");
                              const cart = Array.isArray(raw) ? raw : [];
                              const existing = cart.find(item => item.id === product.id);
                              if (existing) existing.qty = Math.min(Number(existing.qty || 0) + 1, 100);
                              else cart.push({ id: product.id, name: product.name, price: product.price, image: normalizeImagePath(product.image, product.name), qty: 1 });
                              localStorage.setItem("ianis-bakery-cart", JSON.stringify(cart));
                            } catch {
                              event.preventDefault();
                              setMessage("No se pudo agregar el producto. Verifica que el navegador permita guardar el carrito.");
                            }
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#A84355] px-4 py-3 font-black text-white"
                        >
                          <ShoppingBag size={17} />
                          Ordenar
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
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

  if (name.includes("peanut")) {
    return "/peanut-butter.png";
  }

  if (name.includes("double") || name.includes("doble")) {
    return "/double-chocolate.png";
  }

  if (name.includes("dulce")) {
    return "/dulce-leche.png";
  }

  if (
    name.includes("marshmallow") ||
    name.includes("malvavisco")
  ) {
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
