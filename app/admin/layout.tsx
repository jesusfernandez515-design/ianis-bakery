"use client";

import { onIdTokenChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { isAdministrator } from "@/lib/admin-access";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [access, setAccess] = useState<"loading" | "allowed" | "denied">("loading");
  useEffect(() => {
    let generation = 0;
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const current = ++generation;
      setAccess("loading");
      if (!user) {
        setAccess("denied");
        router.replace("/login");
        return;
      }
      try {
        const allowed = await isAdministrator(user);
        if (current === generation) setAccess(allowed ? "allowed" : "denied");
      } catch {
        if (current === generation) setAccess("denied");
      }
    });
    return () => { generation++; unsubscribe(); };
  }, [router]);
  if (access !== "allowed") return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#050202] p-6 text-[#F2B6AD]">
      <p role="status">{access === "loading" ? "Verificando acceso..." : "Esta cuenta no tiene permisos de administrador."}</p>
      {access === "denied" && <Link href="/account">Volver a mi cuenta</Link>}
    </main>
  );
  return <div>
    <button className="fixed bottom-5 right-5 z-50 rounded-full bg-[#F2B6AD] px-5 py-3 font-bold text-[#050202]" onClick={async () => {
      setAccess("denied");
      await signOut(auth);
      router.replace("/login");
    }}>Salir</button>
    {children}
  </div>;
}
