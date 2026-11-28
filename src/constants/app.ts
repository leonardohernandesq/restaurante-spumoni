/** Intervalo do polling da lista de pedidos no admin. */
export const REFETCH_PEDIDOS_MS = 5_000;

/**
 * Bloquear pedidos com a loja fechada (selo Aberto/Fechado no topo e aviso
 * ao escolher um produto). Desativado temporariamente: `true` para reativar.
 */
export const VALIDAR_LOJA_ABERTA = false;

/** Paginação da lista de pedidos no admin. */
export const DEFAULT_PER_PAGE = 20;
export const PER_PAGE_OPTIONS = [10, 20, 50] as const;

/** Categoria que sempre aparece primeiro no cardápio. */
export const CATEGORIA_DESTAQUE = "Pratos do Dia";

/**
 * Site público (front na Vercel). Não confundir com a API, que fica em
 * `NEXT_PUBLIC_API_URL`. Usado no sitemap, robots e metadados.
 */
export const SITE = {
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://site.restaurantespumoni.com.br"
  ).replace(/\/+$/, ""),
  nome: "Restaurante Spumoni",
  titulo: "Restaurante Spumoni - O melhor restaurante do Alto Tietê",
  descricao:
    "Marmitex, pratos do dia, porções, açaí e sobremesas. Peça online para entrega ou retirada no Restaurante Spumoni.",
} as const;

/** Monta a URL pública de uma imagem enviada pela API. */
export const imagemUrl = (arquivo?: string | null): string | undefined =>
  arquivo ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}/${arquivo}` : undefined;

/**
 * Dados da loja que ainda não existem nas configurações da API.
 * TODO (backend): mover para `configuracoes_loja`.
 */
export const LOJA = {
  nome: "Restaurante Spumoni",
  nomeCompleto: "Restaurante & Sorveteria Spumoni",
  cnpj: "27.417.449/0001-06",
  /** Usado só se `settings.whatsapp_number` não carregar. */
  whatsappFallback: "5511930854943",
} as const;
