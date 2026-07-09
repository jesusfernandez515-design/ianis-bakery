"use client";

import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  ArrowLeft,
  Cookie,
  Download,
  Heart,
  Search,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";

type Feedback = {
  id: string;
  name?: string;
  flavor?: string;
  taste?: number;
  texture?: number;
  appearance?: number;
  aroma?: number;
  size?: number;
  value?: number;
  price?: string;
  wouldBuy?: string;
  favorite?: string;
  improve?: string;
  newFlavor?: string;
  comments?: string;
  createdAt?: {
    seconds?: number;
  };
};

const buyOptions = [
  "Todas",
  "Sí, definitivamente",
  "Probablemente sí",
  "No estoy seguro(a)",
  "Probablemente no",
  "Definitivamente no",
];

export default function AdminResponsesPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");
  const [buyFilter, setBuyFilter] = useState("Todas");

  useEffect(() => {
    const q = query(
      collection(db, "ianisFeedback"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Feedback[];

      setFeedback(data);
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return feedback.filter((item) => {
      const matchesSearch = `${item.name || ""} ${item.flavor || ""} ${
        item.price || ""
      } ${item.favorite || ""} ${item.comments || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBuy =
        buyFilter === "Todas" || item.wouldBuy === buyFilter;

      return matchesSearch && matchesBuy;
    });
  }, [feedback, search, buyFilter]);

  const averageTaste = useMemo(() => {
    const values = feedback
      .map((item) => Number(item.taste || 0))
      .filter((value) => value > 0);

    if (!values.length) return 0;

    return (
      values.reduce((total, value) => total + value, 0) / values.length
    ).toFixed(1);
  }, [feedback]);

  const buyIntent = useMemo(() => {
    if (!feedback.length) return 0;

    const positive = feedback.filter(
      (item) =>
        item.wouldBuy === "Sí, definitivamente" ||
        item.wouldBuy === "Probablemente sí"
    ).length;

    return Math.round((positive / feedback.length) * 100);
  }, [feedback]);

  const exportCSV = () => {
    const headers = [
      "Nombre",
      "Sabor",
      "Sabor Rating",
      "Textura",
      "Apariencia",
      "Aroma",
      "Tamaño",
      "Valor",
      "Precio",
      "Compraría",
      "Lo que más gustó",
      "Qué mejoraría",
      "Nuevo sabor",
      "Comentarios",
    ];

    const rows = filtered.map((item) => [
      item.name || "",
      item.flavor || "",
      item.taste || "",
      item.texture || "",
      item.appearance || "",
      item.aroma || "",
      item.size || "",
      item.value || "",
      item.price || "",
      item.wouldBuy || "",
      item.favorite || "",
      item.improve || "",
      item.newFlavor || "",
      item.comments || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ianis-bakery-respuestas.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#050202] px-5 py-8 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(242,182,173,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.14),transparent_38%)]" />

      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <Link
            href="/admin"
            className="mb-6 inline-flex items-center gap-2 text-sm font-black text-[#F2B6AD]"
          >
            <ArrowLeft size={18} />
            Volver al dashboard
          </Link>

          <div className="rounded-[2.5rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo-ianis.png"
                  alt="Ianis Bakery"
                  width={84}
                  height={84}
                  className="rounded-full border border-[#FFF3EE]/60 object-contain"
                  priority
                />

                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#D8A85B]">
                    Respuestas
                  </p>
                  <h1 className="mt-2 text-4xl font-black md:text-5xl">
                    Encuestas recibidas
                  </h1>
                  <p className="mt-2 text-sm text-[#FFF3EE]/55">
                    Revisa cada opinión, filtra respuestas y descarga los datos.
                  </p>
                </div>
              </div>

              <button
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#F2B6AD] px-6 py-4 font-black text-[#050202]"
              >
                <Download />
                Exportar CSV
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          <StatCard
            icon={<Users />}
            label="Total respuestas"
            value={feedback.length.toString()}
          />
          <StatCard
            icon={<Star />}
            label="Promedio sabor"
            value={`${averageTaste}/10`}
          />
          <StatCard
            icon={<ThumbsUp />}
            label="Compraría"
            value={`${buyIntent}%`}
          />
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                Filtros
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Buscar respuestas
              </h2>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex items-center gap-2 rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 px-4 py-3">
                <Search size={18} className="text-[#F2B6AD]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nombre, sabor, comentario..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#FFF3EE]/35 md:w-72"
                />
              </div>

              <select
                value={buyFilter}
                onChange={(e) => setBuyFilter(e.target.value)}
                className="rounded-2xl border border-[#E8A39A]/15 bg-[#050202]/70 px-4 py-3 text-sm font-bold text-[#FFF3EE] outline-none"
              >
                {buyOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#050202]">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          {filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#E8A39A]/20 bg-[#1A0D0B]/70 p-10 text-center">
              <Cookie className="mx-auto mb-4 text-[#F2B6AD]" size={44} />
              <h3 className="text-2xl font-black">No hay respuestas</h3>
              <p className="mt-2 text-[#FFF3EE]/55">
                Cambia los filtros o espera nuevas encuestas.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-5 shadow-2xl shadow-black/25"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                      {item.name || "Cliente anónimo"}
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-[#F2B6AD]">
                      {item.flavor || "Sin sabor"}
                    </h2>

                    <p className="mt-2 text-sm text-[#FFF3EE]/55">
                      {formatDate(item.createdAt?.seconds)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge>{item.taste || 0}/10 sabor</Badge>
                    <Badge>{item.texture || 0}/10 textura</Badge>
                    <Badge>{item.appearance || 0}/10 presentación</Badge>
                    <Badge>{item.price || "Sin precio"}</Badge>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <Info title="¿Compraría?" text={item.wouldBuy} highlight />
                  <Info title="Lo que más gustó" text={item.favorite} />
                  <Info title="Qué mejoraría" text={item.improve} />
                  <Info title="Nuevo sabor" text={item.newFlavor} />
                </div>

                <div className="mt-3">
                  <Info title="Comentarios adicionales" text={item.comments} />
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function formatDate(seconds?: number) {
  if (!seconds) return "Fecha no disponible";

  return new Date(seconds * 1000).toLocaleString("es-PR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2B6AD] text-[#050202]">
        {icon}
      </div>
      <p className="text-sm text-[#FFF3EE]/55">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#F2B6AD]">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#E8A39A]/15 bg-[#2A1713] px-3 py-1 text-xs font-bold text-[#FFF3EE]/75">
      {children}
    </span>
  );
}

function Info({
  title,
  text,
  highlight,
}: {
  title: string;
  text?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-[#F2B6AD]/35 bg-[#F2B6AD]/10"
          : "border-[#E8A39A]/10 bg-[#050202]/70"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D8A85B]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#FFF3EE]/75">
        {text || "Sin respuesta"}
      </p>
    </div>
  );
}
