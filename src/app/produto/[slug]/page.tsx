import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { produtoService } from "@/services/produto";
import { imagemUrl } from "@/constants/app";
import ProductClient, { type ProdutoDetalhe } from "./ProductClient";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Uma única chamada à API por requisição, usada pelos metadados e pela página.
 * Devolve `null` se o produto não existir ou a API falhar.
 */
const buscarProduto = cache(async (slug: string) => {
  try {
    const produto = await produtoService.buscar(slug);
    // GET /product sempre devolve descricao e atributo_id (ver ProdutoDetalhe)
    return produto ? (produto as unknown as ProdutoDetalhe) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
});

/** Texto curto para a descrição de busca/compartilhamento. */
const resumir = (texto: string, max = 160) =>
  texto.length > max ? `${texto.slice(0, max - 1).trimEnd()}…` : texto;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const produto = await buscarProduto(slug);
  if (!produto) return { title: "Produto não encontrado" };

  const descricao = resumir(produto.descricao || produto.name);
  const imagem = imagemUrl(produto.image);

  return {
    title: produto.name,
    description: descricao,
    alternates: { canonical: `/produto/${produto.slug}` },
    openGraph: {
      title: produto.name,
      description: descricao,
      url: `/produto/${produto.slug}`,
      images: imagem ? [{ url: imagem, alt: produto.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const produto = await buscarProduto(slug);

  if (!produto) notFound();

  return <ProductClient produto={produto} />;
}
