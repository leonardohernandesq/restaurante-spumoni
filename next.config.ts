import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança em todas as páginas.
 * - Ninguém pode abrir o site dentro de um iframe (evita "clickjacking" no admin).
 * - O navegador não "adivinha" tipos de arquivo nem libera câmera/microfone/localização.
 * O CSP aqui não restringe scripts (o Next usa scripts inline); só fecha
 * iframes, <base>, <object> e o destino de formulários.
 */
const cabecalhosDeSeguranca = [
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Só otimiza imagens da pasta de imagens da API (não qualquer arquivo do domínio)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "restaurantespumoni.com.br",
        pathname: "/api/public/images/**",
      },
      {
        protocol: "https",
        hostname: "lhdev.com.br",
        pathname: "/restaurante/public/images/**",
      },
    ],
  },
  allowedDevOrigins: [
    "https://admin.lhdev.com.br:3000",
    "https://site.restaurantespumoni.com.br/admin",
    "https://site.restaurantespumoni.com.br",
  ],
  async headers() {
    return [{ source: "/:path*", headers: cabecalhosDeSeguranca }];
  },
};

export default nextConfig;
