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
  const categories = categoryStore(state => state.categories);
  const getAllCategories = categoryStore(state => state.getAll);

  const products = productStore(state => state.products);
  const fetchProducts = productStore(state => state.fetchProducts);

  useEffect(() => {
    getAllCategories();
    fetchProducts(0);
  }, [getAllCategories, fetchProducts]);

  // 🔹 Converte para IProductAll[] antes de passar para ProductSection
  const productsAll: IProductAll[] = categories.map(cat => ({
    id: cat.id.toString(), // Convert id to string
    category: cat.nome ?? "",
    descriptionCategory: cat.descricao ?? "",
    products: products.filter(p => p.categoria_id === cat.id)
  }));

  return (
    <main className="bg-zinc-100">
      <Header />
      <CategoryScroll categories={categories} />
      <ProductSection data={productsAll} />
      <Footer />
    </main>
  );
}
