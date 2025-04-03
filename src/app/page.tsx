import { useMetadata } from "@/hooks/useMetadata";
import { useJsonLd } from "@/hooks/useJsonLd";
import { Header } from "@/components/header";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <main>
        <Header />
        <div>
          <h1>Restaurante Spumoni</h1>
        </div>
        <div>
          <p>O sabor autêntico da culinária italiana.</p>
        </div>
      </main>
    </>
  );
}
