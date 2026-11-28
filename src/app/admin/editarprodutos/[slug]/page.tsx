"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/produto/ProductForm";

export default function EditarProdutoPage() {
  const { slug } = useParams<{ slug: string }>();
  return <ProductForm slug={slug} />;
}
