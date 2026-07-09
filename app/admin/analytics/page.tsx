"use client";

import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Cookie,
  Download,
  Heart,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const ranges = ["Todo", "Hoy", "7 días", "30 días"];

export default function AnalyticsPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [range, setRange] = useState("Todo");

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
    if (range === "Todo") return feedback;

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const limit =
      range === "Hoy" ? now - day : range === "7 días" ? now - day * 7 : now - day * 30;

    return feedback.filter((item) => {
      const time = item.createdAt?.seconds
        ? item.createdAt.seconds * 1000
        : now;

      return time >= limit;
    });
  }, [feedback, range]);

  const average = (field: keyof Feedback) => {
    const values = filtered
      .map((item) => Number(item[field] || 0))
      .filter((value) => value > 0);

    if (!values.length) return 0;

    return Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)
    );
  };

  const buyIntent = useMemo(() => {
    if (!filtered.length) return 0;

    const positive = filtered.filter(
      (item) =>
        item.wouldBuy === "Sí, definitivamente" ||
        item.wouldBuy === "Probablemente sí"
    ).length;

    return Math.round((positive / filtered.length) * 100);
  }, [filtered]);

  const flavorRanking = useMemo(() => {
    const map = new Map<string, { flavor: string; total: number; count: number }>();

    filtered.forEach((item) => {
      const flavor = item.flavor || "Sin sabor";
      const current = map.get(flavor) || { flavor, total: 0, count: 0 };

      current.total += Number(item.taste || 0);
      current.count += 1;

      map.set(flavor, current);
    });

    return Array.from(map.values())
      .map((item) => ({
        flavor: item.flavor,
        average: Number((item.total / item.count).toFixed(1)),
        count: item.count,
      }))
      .sort((a, b) => b.average - a.average);
  }, [filtered]);

  const priceData = useMemo(() => {
    const map = new Map<string, number>();

    filtered.forEach((item) => {
      if (!item.price) return;
      map.set(item.price, (map.get(item.price) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const chartData = [
    { name: "Sabor", value: average("taste") },
    { name: "Textura", value: average("texture") },
    { name: "Presentación", value: average("appearance") },
    { name: "Aroma", value: average("aroma") },
    { name: "Tamaño", value: average("size") },
    { name: "Valor", value: average("value") },
  ];

  const topFlavor = flavorRanking[0];

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
      "Compraria",
      "Favorito",
      "Mejoras",
      "Nuevo Sabor",
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
    link.download = "ianis-bakery-analytics.csv";
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
                    Analytics Pro
                  </p>
                  <h1 className="mt-2 text-4xl font-black md:text-5xl">
                    Ianis Bakery
                  </h1>
                  <p className="mt-2 text-sm text-[#FFF3EE]/55">
                    Datos premium para tomar decisiones de sabor, precio y venta.
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

        <section className="mb-8 flex flex-wrap gap-3">
          {ranges.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded-full px-5 py-3 font-black transition ${
                range === item
                  ? "bg-[#F2B6AD] text-[#050202]"
                  : "border border-[#E8A39A]/20 bg-[#1A0D0B]/80 text-[#F2B6AD]"
              }`}
            >
              {item}
            </button>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card icon={<Users />} label="Respuestas" value={filtered.length.toString()} />
          <Card icon={<Star />} label="Satisfacción" value={`${average("taste")}/10`} />
          <Card icon={<Heart />} label="Compraría" value={`${buyIntent}%`} />
          <Card icon={<Trophy />} label="Ganador" value={topFlavor?.flavor || "Sin datos"} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                  Promedios
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Calidad del producto
                </h2>
              </div>
              <BarChart3 className="text-[#F2B6AD]" />
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A211B" />
                  <XAxis dataKey="name" stroke="#FFF3EE" fontSize={12} />
                  <YAxis stroke="#FFF3EE" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      background: "#1A0D0B",
                      border: "1px solid rgba(232,163,154,0.25)",
                      borderRadius: "16px",
                      color: "#FFF3EE",
                    }}
                  />
                  <Bar dataKey="value" radius={[14, 14, 0, 0]} fill="#F2B6AD" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
              Precio ideal
            </p>
            <h2 className="mt-2 text-2xl font-black">Preferencias</h2>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priceData} dataKey="value" nameKey="name" outerRadius={95}>
                    {priceData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          ["#F2B6AD", "#D8A85B", "#E8A39A", "#FFF3EE"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1A0D0B",
                      border: "1px solid rgba(232,163,154,0.25)",
                      borderRadius: "16px",
                      color: "#FFF3EE",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
              Ranking
            </p>
            <h2 className="mt-2 text-2xl font-black">Sabores ganadores</h2>

            <div className="mt-6 space-y-4">
              {flavorRanking.length === 0 ? (
                <Empty />
              ) : (
                flavorRanking.map((item, index) => (
                  <div
                    key={item.flavor}
                    className="rounded-2xl border border-[#E8A39A]/10 bg-[#050202]/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-[#F2B6AD]">
                          #{index + 1} {item.flavor}
                        </p>
                        <p className="text-sm text-[#FFF3EE]/55">
                          {item.count} respuesta(s)
                        </p>
                      </div>

                      <span className="rounded-full bg-[#F2B6AD] px-3 py-1 text-sm font-black text-[#050202]">
                        {item.average}/10
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-gradient-to-br from-[#F2B6AD] to-[#D8A85B] p-6 text-[#050202] shadow-2xl shadow-[#E8A39A]/20">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#050202] text-[#F2B6AD]">
              <CalendarDays />
            </div>

            <p className="text-sm font-black uppercase tracking-[0.25em]">
              Recomendación
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Producto listo para validar ventas.
            </h2>

            <p className="mt-4 leading-7 text-[#2A1713]/80">
              Si la intención de compra se mantiene sobre 70%, Ianis Bakery puede
              comenzar a vender muestras pagadas, paquetes de 4 cookies y cajas
              para regalo.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[#050202] px-6 py-4 font-black text-[#FFF3EE]"
            >
              Ver menú
              <Cookie />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
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

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-[#E8A39A]/20 bg-[#050202]/50 p-8 text-center">
      <Cookie className="mx-auto mb-3 text-[#F2B6AD]" />
      <p className="text-[#FFF3EE]/55">Todavía no hay datos.</p>
    </div>
  );
     }
