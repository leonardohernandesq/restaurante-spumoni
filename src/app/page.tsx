'use client';

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

  const loading = prodLoading || catLoading;

  useEffect(() => {
    Promise.all([getAll(), fetchProducts(0)]);
  }, [getAll, fetchProducts]);

  const productsAll: IProductAll[] = categories.map(cat => ({
    id: cat.id.toString(),
    category: cat.nome ?? "",
    descriptionCategory: cat.descricao ?? "",
    products: products.filter(p => p.categoria_id === cat.id)
  }));

  return (
    <main className="bg-zinc-100">
      <Header />
      {
        loading ?
          <>
            <div className="flex justify-center items-center h-screen">Loading...</div>
          </> :
          <>
            <CategoryScroll categories={categories} />
            <ProductSection data={productsAll} />
          </>
      }
      <Footer />
    </main>
  );
}
