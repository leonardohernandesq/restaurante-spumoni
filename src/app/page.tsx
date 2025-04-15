import { useMetadata } from "@/hooks/useMetadata";
import { useJsonLd } from "@/hooks/useJsonLd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { IProductAll } from "@/interfaces/IProductAll";
import Link from "next/link";
import CategoryScroll from "@/components/CategoryScroll";

export const useGenerateMetadata = () =>
  useMetadata(
    "Restaurante Spumoni | O Melhor da Culinária Italiana",
    "Descubra o sabor autêntico da Itália no Restaurante Spumoni. Massas frescas, pizzas artesanais e muito mais!",
    "https://meusite.com",
    "https://meusite.com/spumoni-home.jpg"
  );

export default function Home() {
  const jsonLd = useJsonLd(
    "Restaurante Spumoni | O Melhor da Culinária Italiana",
    "Descubra o sabor autêntico da Itália no Restaurante Spumoni. Massas frescas, pizzas artesanais e muito mais!",
    "https://meusite.com",
    "https://meusite.com/spumoni-home.jpg"
  );

  const productsAll: IProductAll[] = [
    {
      "id": "1",
      "category": "Pratos do Dia",
      "descriptionCategory": "Saboreie nossos pratos do dia, preparados com ingredientes frescos e muito sabor!",
      "products": [
        {
          "id": "1",
          "name": "Filé de Frango Grelhado",
          "slug": "file-de-frango-grelhado",
          "description": "Delicioso filé de frango grelhado ao ponto, temperado com ervas frescas e especiarias, servido com arroz branco soltinho, feijão caseiro bem temperado, legumes refogados no azeite e uma salada fresca para acompanhar.",
          "image": "prato.png",
          "price": "00,00"
        },
        {
          "id": "2",
          "name": "Feijoada",
          "slug": "feijoada",
          "description": "Deliciosa Feijoada, temperado com ervas frescas e especiarias, servido com arroz branco soltinho, feijão caseiro bem temperado, legumes refogados no azeite e uma salada fresca para acompanhar.",
          "image": "prato.png",
          "price": "40,00"
        },
      ]
    },
  ]


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <main className="bg-zinc-100">
        <Header />
        <CategoryScroll />
        <ProductSection data={productsAll} />
        <Footer />
      </main>
    </>
  );
}
