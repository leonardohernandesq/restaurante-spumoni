import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { SITE } from "@/constants/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.titulo,
    template: `%s | ${SITE.nome}`,
  },
  description: SITE.descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    title: SITE.titulo,
    description: SITE.descricao,
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
      >
        {/* Barra de progresso no topo ao trocar de página (links e router.push) */}
        <NextTopLoader
          color="#973f78"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #973f78,0 0 5px #973f78"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
