import { useMetadata } from "@/hooks/useMetadata";
import { useJsonLd } from "@/hooks/useJsonLd";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductSection } from "@/components/product-section";
import { IProductAll } from "@/interfaces/IProductAll";
import Link from "next/link";

export const generateMetadata = () =>
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
  const linkActive = 2;


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <main className="bg-zinc-100">
        <Header />
        <div className="block overflow-x-auto px-6 pt-3 pb-4 bg-zinc-100 mt-[-20] z-50 relative rounded-t-2xl">
          <div className="flex gap-4 w-max">
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 1 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 1 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 2 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 2 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 3 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 3 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 4 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 4 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 5 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 5 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 6 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 6 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 7 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 7 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 8 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 8 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 9 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 9 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
            <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 10 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 10 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
          </div>
        </div>

        <div>
          <ProductSection data={productsAll} />
        </div>
        <Footer />
      </main>
    </>
  );
}
