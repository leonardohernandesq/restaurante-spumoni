import { Metadata } from "next";

export const useMetadata = (
  title: string,
  description: string,
  url: string,
  imageUrl: string
): Metadata => {
  const restaurantName = "Restaurante Spumoni";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: restaurantName,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};
