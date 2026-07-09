"use client";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (user === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050202] text-[#F2B6AD]">
        <p className="text-lg font-black">Cargando panel...</p>
      </main>
    );
  }

  return (
    <div>
      <button
        onClick={logout}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#F2B6AD] px-5 py-3 text-sm font-black text-[#050202] shadow-2xl"
      >
        <LogOut size={18} />
        Salir
      </button>

      {children}
    </div>
  );
}
