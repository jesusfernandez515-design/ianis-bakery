"use client";

import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  ArrowLeft,
  BarChart3,
  Cookie,
  DollarSign,
  Heart,
  Home,
  QrCode,
  Search,
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
};

const surveyUrl = "https://ianis-bakery.vercel.app/taste";

export default function AdminDashboardPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");

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
      const text = `${item.name || ""} ${item.flavor || ""} ${
        item.wouldBuy || ""
      } ${item.price || ""}`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [feedback, search]);

  const average = (field: keyof Feedback) => {
    const values = feedback
      .map((item) => Number(item[field] || 0))
      .filter((value) => value > 0);

    if (!values.length) return 0;

    return Number(
      (values.reduce((total, value) => total + value, 0) / values.length).toFixed(
        1
      )
    );
  };

  const buyIntent = useMemo(() => {
    if (!feedback.length) return 0;

    const positive = feedback.filter(
      (item) =>
        item.wouldBuy === "Sí, definitivamente" ||
        item.wouldBuy === "Probablemente sí"
    ).length;

    return Math.round((positive / feedback.length) * 100);
  }, [feedback]);

  const flavorRanking = useMemo(() => {
    const map = new Map<
      string,
      { flavor: string; total: number; count: number }
    >();

    feedback.forEach((item) => {
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
  }, [feedback]);

  const priceData = useMemo(() => {
    const map = new Map<string, number>();

    feedback.forEach((item) => {
      if (!item.price) return;
      map.set(item.price, (map.get(item.price) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [feedback]);

  const chartData = [
    { name: "Sabor", value: average("taste") },
    { name: "Textura", value: average("texture") },
    { name: "Presentación", value: average("appearance") },
    { name: "Aroma", value: average("aroma") },
    { name: "Tamaño", value: average("size") },
    { name: "Valor", value: average("value") },
  ];

  const topFlavor = flavorRanking[0];

  return (
    <main className="min-h-screen bg-[#0B0706] px-5 py-8 text-[#FFF3EE]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(232,163,154,0.20),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(216,168,91,0.14),transparent_35%)]" />

      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#F2B6AD]"
          >
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>

          <div className="flex flex-col gap-6 rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-ianis.png"
                alt="Ianis Bakery"
                width={84}
                height={84}
                className="rounded-full border border-[#E8A39A]/30 object-cover"
                priority
              />

              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D8A85B]">
                  Admin Dashboard
                </p>
                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  Ianis Bakery
                </h1>
                <p className="mt-2 text-sm text-[#FFF3EE]/55">
                  Panel premium para analizar degustaciones y decisiones de venta.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <QuickLink href="/" icon={<Home />} label="Inicio" />
              <QuickLink href="/taste" icon={<Cookie />} label="Encuesta" />
              <QuickLink href="/qr" icon={<QrCode />} label="QR" />
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-gradient-to-br from-[#F2B6AD] to-[#D8A85B] p-6 text-[#0B0706] shadow-2xl shadow-[#E8A39A]/20 lg:col-span-2">
            <p className="text-sm font-black uppercase tracking-[0.3em]">
              Acceso rápido
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Comparte el QR de degustación
            </h2>
            <p className="mt-3 max-w-2xl text-[#2A1713]/80">
              Usa esta página para que las personas escaneen, prueben la galleta
              y dejen su opinión en menos de dos minutos.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/qr"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0B0706] px-6 py-4 font-black text-[#FFF3EE]"
              >
                <QrCode />
                Abrir página QR
              </Link>

              <Link
                href="/taste"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#0B0706]/20 bg-[#FFF3EE]/60 px-6 py-4 font-black text-[#0B0706]"
              >
                <Cookie />
                Abrir encuesta
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
              Redes
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#F2B6AD]">
              Instagram
            </h2>
            <p className="mt-3 text-[#FFF3EE]/60">
              Usa esta cuenta en stickers, empaques, tarjetas y publicaciones.
            </p>
            <div className="mt-5 rounded-2xl border border-[#E8A39A]/15 bg-[#0B0706]/70 p-4">
              <p className="text-xl font-black text-[#F2B6AD]">
                @ianis_bakery
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users />}
            label="Total de respuestas"
            value={feedback.length.toString()}
          />
          <StatCard
            icon={<Star />}
            label="Promedio de sabor"
            value={`${average("taste")}/10`}
          />
          <StatCard
            icon={<Heart />}
            label="Intención de compra"
            value={`${buyIntent}%`}
          />
          <StatCard
            icon={<Trophy />}
            label="Sabor líder"
            value={topFlavor?.flavor || "Sin datos"}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                  Calificaciones
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Promedios generales
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
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#F2B6AD" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                Precio
              </p>
              <h2 className="mt-2 text-2xl font-black">Preferencia</h2>
            </div>

            <div className="h-72">
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

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
              Ranking
            </p>
            <h2 className="mt-2 text-2xl font-black">Sabores favoritos</h2>

            <div className="mt-6 space-y-4">
              {flavorRanking.length === 0 ? (
                <Empty text="Todavía no hay respuestas." />
              ) : (
                flavorRanking.map((item, index) => (
                  <div
                    key={item.flavor}
                    className="rounded-2xl border border-[#E8A39A]/10 bg-[#0B0706]/70 p-4"
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

                      <span className="rounded-full bg-[#F2B6AD] px-3 py-1 text-sm font-black text-[#0B0706]">
                        {item.average}/10
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E8A39A]/15 bg-[#1A0D0B]/90 p-6 shadow-2xl shadow-black/30 lg:col-span-2">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#D8A85B]">
                  Respuestas
                </p>
                <h2 className="mt-2 text-2xl font-black">Opiniones recibidas</h2>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[#E8A39A]/15 bg-[#0B0706]/70 px-4 py-3">
                <Search size={18} className="text-[#F2B6AD]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="bg-transparent text-sm outline-none placeholder:text-[#FFF3EE]/35"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filtered.length === 0 ? (
                <Empty text="No hay respuestas para mostrar." />
              ) : (
                filtered.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[#E8A39A]/10 bg-[#0B0706]/70 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xl font-black text-[#F2B6AD]">
                          {item.flavor || "Sin sabor"}
                        </p>
                        <p className="text-sm text-[#FFF3EE]/55">
                          {item.name || "Cliente anónimo"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge>{item.taste || 0}/10 sabor</Badge>
                        <Badge>{item.texture || 0}/10 textura</Badge>
                        <Badge>{item.price || "Sin precio"}</Badge>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <Comment title="Lo que más gustó" text={item.favorite} />
                      <Comment title="Qué mejoraría" text={item.improve} />
                      <Comment title="Nuevo sabor" text={item.newFlavor} />
                      <Comment title="Comentario" text={item.comments} />
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E8A39A]/15 bg-[#0B0706]/70 px-5 py-4 font-black text-[#F2B6AD] transition hover:bg-[#2A1713]"
    >
      {icon}
      {label}
    </Link>
  );
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
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2B6AD] text-[#0B0706]">
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

function Comment({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border border-[#E8A39A]/10 bg-[#1A0D0B]/80 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D8A85B]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#FFF3EE]/70">
        {text || "Sin respuesta"}
      </p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E8A39A]/20 bg-[#0B0706]/50 p-8 text-center">
      <Cookie className="mx-auto mb-3 text-[#F2B6AD]" />
      <p className="text-[#FFF3EE]/55">{text}</p>
    </div>
  );
}
