"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Menu,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function PremiumAppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideChrome =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="fixed left-1/2 top-4 z-50 w-[94%] max-w-5xl -translate-x-1/2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={48}
              height={48}
              className="shrink-0 rounded-full border border-[#FFF6EF]/70 object-contain"
              priority
            />

            <div className="min-w-0">
              <p className="truncate font-black leading-none text-[#F5ACB1]">
                Ianis Bakery
              </p>
              <p className="truncate text-xs text-[#D99B55]">
                Cookies gourmet
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavItem href="/" label="Inicio" icon={<Home size={17} />} />
            <NavItem href="/menu" label="Menú" icon={<Menu size={17} />} />
            <NavItem
              href="/cart"
              label="Carrito"
              icon={<ShoppingBag size={17} />}
            />
            <NavItem
              href="/taste"
              label="Opinión"
              icon={<Star size={17} />}
            />
            <NavItem
              href="/account"
              label="Cuenta"
              icon={<User size={17} />}
            />
          </nav>

          <Link
            href="/cart"
            className="shrink-0 rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704] shadow-lg shadow-[#F5ACB1]/20 transition hover:bg-[#FFF6EF]"
          >
            Ordenar
          </Link>
        </div>
      </header>

      <div className="pt-24">{children}</div>

      <Link
        href={`https://wa.me/?text=${encodeURIComponent(
          "Hola Ianis Bakery, quiero hacer un pedido."
        )}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-5 z-50 rounded-full bg-[#25D366] px-5 py-4 font-black text-white shadow-2xl transition hover:scale-105 md:bottom-5"
      >
        WhatsApp
      </Link>

      <nav className="fixed bottom-4 left-1/2 z-50 flex w-[94%] max-w-md -translate-x-1/2 items-center justify-around rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/90 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden">
        <MobileItem
          href="/"
          label="Inicio"
          icon={<Home size={21} />}
          active={pathname === "/"}
        />

        <MobileItem
          href="/menu"
          label="Menú"
          icon={<Menu size={21} />}
          active={pathname.startsWith("/menu")}
        />

        <MobileItem
          href="/cart"
          label="Carrito"
          icon={<ShoppingBag size={21} />}
          active={pathname.startsWith("/cart")}
        />

        <MobileItem
          href="/taste"
          label="Opinión"
          icon={<Star size={21} />}
          active={pathname.startsWith("/taste")}
        />

        <MobileItem
          href="/account"
          label="Cuenta"
          icon={<User size={21} />}
          active={pathname.startsWith("/account")}
        />
      </nav>

      <footer className="border-t border-[#F5ACB1]/10 bg-[#120704] px-5 py-10 text-[#FFF6EF]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-20 md:flex-row md:items-center md:justify-between md:pb-0">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={56}
              height={56}
              className="rounded-full border border-[#FFF6EF]/70 object-contain"
            />

            <div>
              <p className="font-black text-[#F5ACB1]">Ianis Bakery</p>
              <p className="text-sm text-[#FFF6EF]/55">
                Cookies gourmet · Rellenas hasta el centro
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-bold text-[#F5ACB1]">
              Instagram @ianis_bakery
            </p>

            <Link
              href="/login"
              className="text-sm font-bold text-[#FFF6EF]/45 transition hover:text-[#F5ACB1]"
            >
              Acceso administrativo
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function NavItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();

  const active =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-black transition ${
        active
          ? "bg-[#F5ACB1] text-[#120704]"
          : "text-[#FFF6EF]/75 hover:bg-[#F5ACB1] hover:text-[#120704]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
        active
          ? "bg-[#F5ACB1] text-[#120704]"
          : "text-[#F5ACB1] hover:bg-[#F5ACB1]/10"
      }`}
    >
      {icon}
    </Link>
  );
}
