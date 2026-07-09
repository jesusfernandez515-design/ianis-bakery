import type { Metadata } from "next";
import "./globals.css";
import PremiumAppChrome from "@/components/PremiumAppChrome";

export const metadata: Metadata = {
  title: "Ianis Bakery",
  description: "Cookies gourmet rellenas hasta el centro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <PremiumAppChrome>{children}</PremiumAppChrome>
      </body>
    </html>
  );
}
