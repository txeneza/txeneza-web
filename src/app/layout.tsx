import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="pt-MZ" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
