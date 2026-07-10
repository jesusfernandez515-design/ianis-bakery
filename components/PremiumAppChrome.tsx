"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Menu,
  MessageCircle,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

const desktopLinks = [
  {
    href: "/",
    label: "Inicio",
    icon: Home,
  },
  {
    href: "/menu",
    label: "Menú",
    icon: Menu,
  },
  {
    href: "/shop",
    label: "Tienda",
    icon: ShoppingBag,
  },
  {
    href: "/taste",
    label: "Opinión",
    icon: Star,
  },
  {
    href: "/account",
    label: "Cuenta",
    icon: User,
  },
];

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
    <div className="min-h-screen bg-[#120704]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#F5ACB1]/10 bg-[#120704]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between gap-3 px-4 md:h-[86px] md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={54}
              height={54}
              className="h-12 w-12 shrink-0 rounded-full border border-[#FFF6EF]/60 object-cover shadow-[0_0_22px_rgba(245,172,177,0.28)] md:h-14 md:w-14"
              priority
            />

            <div className="min-w-0">
              <p className="truncate text-base font-black leading-none text-[#F5ACB1] md:text-lg">
                Ianis Bakery
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-[#D99B55]">
                Cookies gourmet
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {desktopLinks.map((item) => (
              <DesktopNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActivePath(pathname, item.href)}
                icon={<item.icon size={17} />}
              />
            ))}
          </nav>

          <Link
            href="/cart"
            className="shrink-0 rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704] shadow-lg shadow-[#F5ACB1]/20 transition hover:bg-[#FFF6EF]"
          >
            Ordenar
          </Link>
        </div>
      </header>

      <main className="min-h-screen pb-28 pt-[78px] md:pb-0 md:pt-[86px]">
        {children}
      </main>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          "Hola Ianis Bakery, quiero hacer un pedido."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-[104px] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105 md:bottom-6 md:right-6"
      >
        <MessageCircle size={26} />
      </a>

      <nav className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-24px)] max-w-md -translate-x-1/2 items-center justify-around rounded-[1.7rem] border border-[#F5ACB1]/20 bg-[#210D08]/95 px-2 py-2 shadow-2xl shadow-black/60 backdrop-blur-xl lg:hidden">
        {desktopLinks.map((item) => (
          <MobileNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActivePath(pathname, item.href)}
            icon={<item.icon size={20} />}
          />
        ))}
      </nav>

      <footer className="border-t border-[#F5ACB1]/10 bg-[#0C0403] px-5 py-10 text-[#FFF6EF]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border border-[#FFF6EF]/60 object-cover"
            />

            <div>
              <p className="font-black text-[#F5ACB1]">Ianis Bakery</p>

              <p className="mt-1 text-sm text-[#FFF6EF]/55">
                Cookies gourmet · Rellenas hasta el centro
              </p>
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <a
              href="https://www.instagram.com/ianis_bakery"
              target="_blank"
              rel="noreferrer"
              className="block font-bold text-[#F5ACB1]"
            >
              Instagram @ianis_bakery
            </a>

            <Link
              href="/login"
              className="block text-sm font-semibold text-[#FFF6EF]/40 transition hover:text-[#F5ACB1]"
            >
              Acceso administrativo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function DesktopNavItem({
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
      className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-black transition ${
        active
          ? "bg-[#F5ACB1] text-[#120704]"
          : "text-[#FFF6EF]/70 hover:bg-[#F5ACB1]/10 hover:text-[#F5ACB1]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavItem({
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
      className={`flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition ${
        active
          ? "bg-[#F5ACB1] text-[#120704]"
          : "text-[#F5ACB1]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
