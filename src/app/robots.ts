import type { MetadataRoute } from "next";
import { SITE } from "@/constants/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/carrinho",
        "/finalizar",
        "/obrigado",
        "/recuperar-senha",
        "/alterar-senha",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
