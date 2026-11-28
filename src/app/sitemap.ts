import type { MetadataRoute } from "next";
import { SITE } from "@/constants/app";
import { achatarProdutos, produtoService } from "@/services/produto";

// Regerado a cada hora: produto novo entra sem precisar de deploy
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap[number] = {
    url: `${SITE.url}/`,
    changeFrequency: "daily",
    priority: 1,
  };

  try {
    // `all = 1`: inclui os pratos que não estão à venda hoje (dias da semana).
    // Só os produtos ativos entram.
    const produtos = achatarProdutos(await produtoService.listarCardapio(true)).filter(
      (p) => p.slug && (p.active ?? p.ativo) !== false,
    );
    const slugs = [...new Set(produtos.map((p) => p.slug))];

    return [
      home,
      ...slugs.map((slug) => ({
        url: `${SITE.url}/produto/${encodeURIComponent(slug)}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch (error) {
    // Sem a API, publica ao menos a home (e tenta de novo no próximo revalidate)
    console.error("Erro ao gerar sitemap:", error);
    return [home];
  }
}
