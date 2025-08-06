import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { CategoryScroll } from "@/components/CategoryScroll";
import { getAllCategory } from "@/services/category";
import { getAllProducts } from "@/services/produto";

export default async function Home() {
  const categories = await getAllCategory();
  const productsAll = await getAllProducts();
  return (
    <main className="bg-zinc-100">
      <Header />
      <CategoryScroll categories={categories} />
      <ProductSection data={productsAll} />
      <Footer />
    </main>
  );
}
