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

const navigationItems = [
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
    <div className="min-h-screen bg-[#0C0C0C]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#B88B61]/25 bg-[#0C0C0C]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between gap-3 px-4 md:h-[86px] md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 rounded-full border border-[#F1E2DC]/60 object-cover shadow-[0_0_22px_rgba(217,132,120,0.28)] md:h-14 md:w-14"
              priority
            />

            <div className="min-w-0">
              <p className="brand-display truncate text-lg font-bold leading-none text-[#D98478] md:text-xl">
                Ianis Bakery
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-[#B88B61]">
                Cookies gourmet
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <DesktopNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActivePath(pathname, item.href)}
                  icon={<Icon size={17} />}
                />
              );
            })}
          </nav>

          <Link
            href="/cart"
            className="shrink-0 rounded-full bg-[#D98478] px-5 py-3 text-sm font-black text-[#0C0C0C] shadow-lg shadow-[#D98478]/20 transition hover:bg-[#F1E2DC]"
          >
            Ordenar
          </Link>
        </div>
      </header>

      <main className="min-h-screen pb-28 pt-[78px] md:pt-[86px] lg:pb-0">
        {children}
      </main>

      <nav className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-24px)] max-w-md -translate-x-1/2 items-center justify-around rounded-[1.7rem] border border-[#D98478]/20 bg-[#171313]/96 px-2 py-2 shadow-2xl shadow-black/60 backdrop-blur-xl lg:hidden">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <MobileNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActivePath(pathname, item.href)}
              icon={<Icon size={20} />}
            />
          );
        })}
      </nav>

      <footer className="border-t border-[#D98478]/10 bg-[#080808] px-5 py-10 text-[#F1E2DC]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-20 md:flex-row md:items-center md:justify-between lg:pb-0">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border border-[#F1E2DC]/60 object-cover"
            />

            <div>
              <p className="font-black text-[#D98478]">Ianis Bakery</p>

              <p className="mt-1 text-sm text-[#F1E2DC]/55">
                Cookies gourmet · Rellenas hasta el centro
              </p>
              <p className="mt-2 text-sm text-[#B88B61]">Solo recogido · Holiday, Florida</p>
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <a
              href="https://www.instagram.com/ianis_bakery"
              target="_blank"
              rel="noreferrer"
              className="block font-bold text-[#D98478] transition hover:text-[#F1E2DC]"
            >
              Instagram @ianis_bakery
            </a>

            <a
              href={`https://wa.me/17274039118?text=${encodeURIComponent(
                "Hola Ianis Bakery, quiero hacer un pedido."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="block text-sm font-bold text-[#25D366] transition hover:text-white"
            >
              Hacer pedido por WhatsApp
            </a>

            <Link
              href="/login"
              className="block text-sm font-semibold text-[#F1E2DC]/40 transition hover:text-[#D98478]"
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
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center gap-2 border-b px-3 py-3 text-sm font-semibold transition ${
        active
          ? "border-[#D98478] text-[#D98478]"
          : "border-transparent text-[#F1E2DC]/80 hover:text-[#D98478]"
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
      aria-current={active ? "page" : undefined}
      className={`flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition ${
        active
          ? "bg-[#D98478] text-[#0C0C0C]"
          : "text-[#D98478] hover:bg-[#D98478]/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
