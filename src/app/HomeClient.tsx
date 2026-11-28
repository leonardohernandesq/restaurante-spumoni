"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { CategoryScroll } from "@/components/CategoryScroll";
import { ErrorState } from "@/components/ui/QueryState";
import type { Categoria } from "@/types/categoria";
import type { CategoriaComProdutos, Produto } from "@/types/produto";
import { useCategoriasQuery } from "@/queries/categorias";
import { useProdutosQuery } from "@/queries/produtos";

interface HomeClientProps {
  /** Cardápio buscado no servidor; `undefined` se a API falhou lá. */
  categoriasIniciais?: Categoria[];
  produtosIniciais?: Produto[];
}

export default function HomeClient({
  categoriasIniciais,
  produtosIniciais,
}: HomeClientProps) {
  const categoriasQuery = useCategoriasQuery(categoriasIniciais);
  const produtosQuery = useProdutosQuery(false, produtosIniciais);
  const categories = categoriasQuery.data ?? [];
  const products = produtosQuery.data ?? [];

  const semCardapio =
    (categoriasQuery.isError && !categoriasQuery.data) ||
    (produtosQuery.isError && !produtosQuery.data);

  const productsAll: CategoriaComProdutos[] = categories.map((cat) => ({
    id: cat.id.toString(),
    category: cat.nome ?? "",
    slug: cat.slug,
    descriptionCategory: cat.descricao ?? "",
    products: products.filter(
      (p) => Number(p.categoria_id) === Number(cat.id),
    ),
  }));

  return (
    <main className="bg-zinc-100">
      <Header />

      {semCardapio ? (
        <ErrorState
          mensagem="Não conseguimos carregar o cardápio agora."
          onRetry={() => {
            categoriasQuery.refetch();
            produtosQuery.refetch();
          }}
          tentando={categoriasQuery.isFetching || produtosQuery.isFetching}
        />
      ) : (
        <>
          <CategoryScroll
            categories={categories}
            isLoading={categoriasQuery.isPending}
          />
          <ProductSection
            data={productsAll}
            isLoading={produtosQuery.isPending}
          />
        </>
      )}

      <Footer />
    </main>
  );
}
