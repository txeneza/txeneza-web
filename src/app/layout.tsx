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
  description: "Plataforma colaborativa para mapeamento georreferenciado e denúncia de resíduos sólidos nos bairros periféricos da Beira.",
  icons: {
    icon: [
      { url: "/icons/TXENEZA.svg", type: "image/svg+xml" },
      { url: "/image/TXENEZA.png", type: "image/png" }
    ],
    shortcut: "/icons/TXENEZA.svg",
    apple: "/image/TXENEZA.png"
  },
  openGraph: {
    title: "Txeneza - Gestão de Ocorrências Urbanas da Beira",
    description: "Plataforma colaborativa para mapeamento georreferenciado e denúncia de resíduos sólidos nos bairros periféricos da Beira.",
    url: "https://txeneza.org",
    siteName: "Txeneza",
    images: [
      {
        url: "/image/TXENEZA.png",
        width: 512,
        height: 512,
        alt: "Logo Txeneza",
      }
    ],
    locale: "pt_MZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Txeneza - Gestão de Ocorrências Urbanas da Beira",
    description: "Plataforma colaborativa para mapeamento georreferenciado e denúncia de resíduos sólidos nos bairros periféricos da Beira.",
    images: ["/image/TXENEZA.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-MZ" className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Aplica o tema guardado antes da pintura para evitar o "flash" de tema errado.
            Modo claro é o padrão; escuro apenas quando explicitamente escolhido. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
