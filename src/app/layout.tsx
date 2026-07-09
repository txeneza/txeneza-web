import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { CookieConsent } from "@/components/layout/cookie-consent";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Txeneza - Gestão de Ocorrências Urbanas da Beira",
  description: "Plataforma interativa para reporte, visualização e gestão de ocorrências e incidentes na Cidade da Beira.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-MZ" className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable}`}>
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
