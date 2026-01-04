"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { CategoryScroll } from "@/components/CategoryScroll";
import { categoryStore } from "@/store/categoryStore";
import { productStore } from "@/store/produtoStore";
import { IProductAll } from "@/interfaces/IProductAll";

export default function Home() {
  const { categories, getAll, loading: catLoading } = categoryStore();
  const { products, fetchProducts, loading: prodLoading } = productStore();

  useEffect(() => {
    Promise.all([getAll(), fetchProducts(0)]);
  }, [getAll, fetchProducts]);

  const productsAll: IProductAll[] = categories.map((cat) => ({
    id: cat.id.toString(),
    category: cat.nome ?? "",
    descriptionCategory: cat.descricao ?? "",
    products: products.filter((p) => p.categoria_id === cat.id),
  }));

  return (
    <main className="bg-zinc-100">
      <Header />

      <>
        <CategoryScroll categories={categories} isLoading={catLoading} />
        <ProductSection data={productsAll} isLoading={prodLoading} />
      </>

      <Footer />
    </main>
  );
}
