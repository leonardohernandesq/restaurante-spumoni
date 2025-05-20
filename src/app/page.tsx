import { useMetadata } from "@/hooks/useMetadata";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { CategoryScroll } from "@/components/CategoryScroll";
import { getAllCategory } from "@/services/category";
import { getAllProducts } from "@/services/produto";

export const useGenerateMetadata = () => {
  useMetadata(
    "Restaurante Spumoni | O Melhor da Culinária Italiana",
    "Descubra o sabor autêntico da Itália no Restaurante Spumoni. Massas frescas, pizzas artesanais e muito mais!",
    "https://restaurantespumoni.com.br/",
    "https://restaurantespumoni.com.br/spumoni-home.jpg"
  );
}

export default async function Home() {
  const getAllProduct = 0;
  const categories = await getAllCategory();
  const productsAll = await getAllProducts(getAllProduct);

  return (
    <main className="bg-zinc-100">
      <Header />
      <CategoryScroll categories={categories} />
      <ProductSection data={productsAll} />
      <Footer />
    </main>
  );
}
