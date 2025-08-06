import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { CategoryScroll } from "@/components/CategoryScroll";

export const revalidate = 60;

export default async function Home() {
  const categories = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    { next: { revalidate: 60 } }
  ).then(res => res.json());

  const productsAll = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    { next: { revalidate: 60 } }
  ).then(res => res.json());

  return (
    <main className="bg-zinc-100">
      <Header />
      <CategoryScroll categories={categories} />
      <ProductSection data={productsAll} />
      <Footer />
    </main>
  );
}
