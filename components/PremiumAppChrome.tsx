"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Menu, ShoppingBag, Star, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PremiumAppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideChrome =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (hideChrome) return <>{children}</>;

  return (
    <>
      <div className="fixed left-1/2 top-4 z-50 w-[94%] max-w-5xl -translate-x-1/2 rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-ianis.png"
              alt="Ianis Bakery"
              width={48}
              height={48}
              className="rounded-full border border-[#FFF6EF]/70 object-contain"
              priority
            />
            <div>
              <p className="font-black leading-none text-[#F5ACB1]">
                Ianis Bakery
              </p>
              <p className="text-xs text-[#D99B55]">Cookies gourmet</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavItem href="/" label="Inicio" icon={<Home size={17} />} />
            <NavItem href="/menu" label="Menú" icon={<Menu size={17} />} />
            <NavItem
              href="/cart"
              label="Carrito"
              icon={<ShoppingBag size={17} />}
            />
            <NavItem href="/taste" label="Opinión" icon={<Star size={17} />} />
            <NavItem href="/login" label="Admin" icon={<User size={17} />} />
          </div>

          <Link
            href="/cart"
            className="rounded-full bg-[#F5ACB1] px-5 py-3 text-sm font-black text-[#120704]"
          >
            Ordenar
          </Link>
        </div>
      </div>

      <div className="pt-24">{children}</div>

      <Link
        href={`https://wa.me/?text=${encodeURIComponent(
          "Hola Ianis Bakery, quiero hacer un pedido."
        )}`}
        target="_blank"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[#25D366] px-6 py-4 font-black text-white shadow-2xl"
      >
        WhatsApp
      </Link>

      <div className="fixed bottom-4 left-1/2 z-50 flex w-[94%] max-w-md -translate-x-1/2 items-center justify-around rounded-full border border-[#F5ACB1]/25 bg-[#210D08]/90 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden">
        <MobileItem href="/" icon={<Home />} />
        <MobileItem href="/menu" icon={<Menu />} />
        <MobileItem href="/cart" icon={<ShoppingBag />} />
        <MobileItem href="/taste" icon={<Star />} />
        <MobileItem href="/login" icon={<User />} />
      </div>

      <footer className="border-t border-[#F5ACB1]/10 bg-[#120704] px-5 py-10 text-[#FFF6EF]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 pb-20 md:flex-row md:items-center md:justify-between md:pb-0">
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

          <p className="font-bold text-[#F5ACB1]">
            Instagram @ianis_bakery
          </p>
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
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-black text-[#FFF6EF]/75 transition hover:bg-[#F5ACB1] hover:text-[#120704]"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileItem({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex h-11 w-11 items-center justify-center rounded-full text-[#F5ACB1]"
    >
      {icon}
    </Link>
  );
}
