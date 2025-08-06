import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { CategoryScroll } from "@/components/CategoryScroll";
import { ICategory } from "@/interfaces/ICategory";
import { IProductAll } from "@/interfaces/IProductAll";

export default async function Home() {
  let categories: Array<ICategory> = [];
  let productsAll: Array<IProductAll> = [];

  try {
    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { next: { revalidate: 60 } });
    if (categoriesRes.ok) {
      categories = await categoriesRes.json();
    }
  } catch (e) {
    console.error("Erro ao buscar categorias", e);
  }

  try {
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { next: { revalidate: 60 } });
    if (productsRes.ok) {
      productsAll = await productsRes.json();
    }
  } catch (e) {
    console.error("Erro ao buscar produtos", e);
  }

  return (
    <main className="bg-zinc-100">
      <Header />
      <CategoryScroll categories={categories ? categories : []} />
      <ProductSection data={productsAll ? productsAll : []} />
      <Footer />
    </main>
  );
}
