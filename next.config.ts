import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lhdev.com.br'],
  },
  allowedDevOrigins: ['https://admin.lhdev.com.br:3000', 'https://restaurante-spumoni.vercel.app/admin'],

};

export default nextConfig;
