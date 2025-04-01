import { useMemo } from "react";

export const useJsonLd = (
  title: string,
  description: string,
  url: string,
  imageUrl: string
) => {
  const jsonLdData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Restaurante Spumoni",
    image: imageUrl,
    description,
    priceRange: "$$",
    address: {
      streetAddress: "Rua da Itália, 123",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: "01000-000",
      addressCountry: "BR",
    },
    telephone: "+55 11 1234-5678",
    openingHours: ["Mo-Su 11:00-23:00"],
    url,
  }), [title, description, url, imageUrl]);

  return JSON.stringify(jsonLdData);
};
