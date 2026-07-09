"use client";

import Image from "next/image";
import Link from "next/link";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  Cookie,
  Edit,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";

type Product = {
  id: string;
  name: string;
  price: number;
  tag: string;
  description: string;
  image: string;
  active: boolean;
};

const emptyForm = {
  name: "",
  price: "",
  tag: "",
  description: "",
  image: "/cookies/double-chocolate.png",
  active: true,
};

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Product[];

      setProducts(data);
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((item) =>
      `${item.name} ${item.tag} ${item.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.description) {
      alert("Completa nombre, precio y descripción.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        tag: form.tag || "Premium",
        description: form.description,
        image: form.image,
        active: form.active,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Error guardando producto.");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: String(product.price || ""),
      tag: product.tag || "",
      description: product.description || "",
      image: product.image || "/cookies/double-chocolate.png",
      active: product.active ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProduct = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres borrar este producto?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "products", id));
  };

  return (
    <main className="min-h-screen bg-[#120704] px-5 py-8 text-[#FFF6EF]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,172,177,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(210,142,71,0.20),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black text-[#F5ACB1]"
        >
          <ArrowLeft size={18} />
          Volver al dashboard
        </Link>

        <header className="rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={84}
                height={84}
                className="rounded-full border border-[#FFF6EF]/70 object-contain"
                priority
              />

              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D99B55]">
                  Catálogo dinámico
                </p>
                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  Productos Firebase
                </h1>
                <p className="mt-2 text-sm text-[#FFF6EF]/55">
                  Crea, edita y administra sabores sin tocar código.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F5ACB1] px-6 py-4 text-center font-black text-[#120704]">
              {products.length} productos
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={saveProduct}
            className="h-fit rounded-[2.5rem] border border-[#F5ACB1]/20 bg-[#210D08]/90 p-6 shadow-2xl shadow-black/30 lg:sticky lg:top-6"
          >
            <div className="mb-6 flex items-center gap-3">
              {editingId ? (
                <Edit className="text-[#F5ACB1]" />
              ) : (
                <Plus className="text-[#F5ACB1]" />
              )}
              <h2 className="text-3xl font-black">
                {editingId ? "Editar producto" : "Nuevo producto"}
              </h2>
            </div>

            <div className="space-y-4">
              <Field label="Nombre">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Double Chocolate Lava"
                  className="input"
                />
              </Field>

              <Field label="Precio">
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="4.99"
                  className="input"
                />
              </Field>

              <Field label="Etiqueta">
                <input
                  value={form.tag}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tag: e.target.value }))
                  }
                  placeholder="Nuevo, Premium, Más vendido"
                  className="input"
                />
              </Field>

              <Field label="Imagen">
                <select
                  value={form.image}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="input"
                >
                  <option value="/cookies/menu-board.png">Nutella Supreme</option>
                  <option value="/cookies/peanut-butter.png">
                    Peanut Butter
                  </option>
                  <option value="/cookies/double-chocolate.png">
                    Double Chocolate
                  </option>
                  <option value="/cookies/dulce-leche.png">Dulce de Leche</option>
                  <option value="/cookies/marshmallow.png">Marshmallow</option>
                  <option value="/cookies/coconut.png">Coconut</option>
                </select>
              </Field>

              <Field label="Descripción">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe la cookie..."
                  className="input min-h-28"
                />
              </Field>

              <label className="flex items-center justify-between rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 p-4">
                <span className="font-black text-[#F5ACB1]">Producto activo</span>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }))
                  }
                  className="h-5 w-5"
                />
              </label>

              <button
                disabled={saving}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F5ACB1] px-8 py-5 text-lg font-black text-[#120704] disabled:opacity-60"
              >
                <Save />
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="w-full rounded-2xl border border-[#F5ACB1]/20 bg-[#120704]/70 px-8 py-4 font-black text-[#FFF6EF]"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>

          <section>
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-[#F5ACB1]/15 bg-[#210D08]/90 px-4 py-4">
              <Search size={18} className="text-[#F5ACB1]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full bg-transparent outline-none placeholder:text-[#FFF6EF]/35"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#F5ACB1]/25 bg-[#210D08]/70 p-10 text-center">
                <Cookie className="mx-auto mb-4 text-[#F5ACB1]" size={48} />
                <h2 className="text-3xl font-black">Sin productos</h2>
                <p className="mt-2 text-[#FFF6EF]/55">
                  Crea el primer producto desde el formulario.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[2.2rem] border border-[#F5ACB1]/20 bg-[#FFF6EF] text-[#2A120B] shadow-2xl shadow-black/25"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.image || "/cookies/double-chocolate.png"}
                        alt={product.name}
                        width={700}
                        height={600}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute left-4 top-4 rounded-full bg-[#C95867] px-4 py-2 text-xs font-black text-white">
                        {product.tag || "Premium"}
                      </span>

                      <span
                        className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-black ${
                          product.active
                            ? "bg-[#120704] text-[#F5ACB1]"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {product.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-2xl font-black">{product.name}</h3>
                        <p className="rounded-full bg-[#F5ACB1] px-3 py-1 font-black text-[#120704]">
                          ${Number(product.price || 0).toFixed(2)}
                        </p>
                      </div>

                      <p className="mt-3 min-h-20 text-sm leading-6 text-[#2A120B]/70">
                        {product.description}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => editProduct(product)}
                          className="flex items-center justify-center gap-2 rounded-full border border-[#C95867]/25 bg-white px-4 py-3 font-black text-[#C95867]"
                        >
                          <Edit size={16} />
                          Editar
                        </button>

                        <button
                          onClick={() => removeProduct(product.id)}
                          className="flex items-center justify-center gap-2 rounded-full bg-[#C95867] px-4 py-3 font-black text-white"
                        >
                          <Trash2 size={16} />
                          Borrar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(245, 172, 177, 0.2);
          background: rgba(18, 7, 4, 0.72);
          padding: 15px 16px;
          color: #fff6ef;
          outline: none;
        }

        .input::placeholder {
          color: rgba(255, 246, 239, 0.35);
        }

        select.input option {
          color: black;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-black text-[#F5ACB1]">{label}</span>
      {children}
    </label>
  );
      }
