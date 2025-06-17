import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lhdev.com.br', 'restaurantespumoni.com.br'],
  },
  allowedDevOrigins: ['https://admin.lhdev.com.br:3000', 'https://site.restaurantespumoni.com.br/admin'],

};

export default nextConfig;
