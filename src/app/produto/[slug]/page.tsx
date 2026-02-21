import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/produto";
import ProductClient from "./ProductClient";

export const revalidate = 60;

interface PageProps {
  // params is now a Promise in Next.js 15
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  try {
    // We must await the params object before accessing properties
    const { slug } = await params;

    const produto = await getProductBySlug(slug);

    if (!produto) {
      notFound();
    }

    return <ProductClient produto={produto} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
