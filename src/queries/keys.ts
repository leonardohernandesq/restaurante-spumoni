import type { PedidosFiltro } from "@/types/pedido";

/**
 * Chaves de cache do React Query, num lugar só.
 * Use sempre estas funções (nunca arrays escritos à mão), para que
 * `invalidateQueries` acerte exatamente o que precisa ser recarregado.
 */
export const queryKeys = {
  settings: ["settings"] as const,
  openingHours: ["openingHours"] as const,
  storeStatus: ["storeStatus"] as const,

  fretes: {
    all: ["fretes"] as const,
    todos: ["fretes", "todos"] as const,
  },

  pedidos: {
    all: ["pedidos"] as const,
    /** Prefixo de todas as páginas/filtros da lista. */
    lists: ["pedidos", "list"] as const,
    list: (filtro: PedidosFiltro) => ["pedidos", "list", filtro] as const,
    detail: (id: number) => ["pedidos", "detail", id] as const,
  },

  categorias: {
    all: ["categorias"] as const,
    list: ["categorias", "list"] as const,
    detail: (id: number) => ["categorias", "detail", id] as const,
  },

  produtos: {
    all: ["produtos"] as const,
    /** `incluirInativos` = lista do admin (all=1). */
    list: (incluirInativos: boolean) =>
      ["produtos", "list", incluirInativos] as const,
    detail: (slug: string) => ["produtos", "detail", slug] as const,
  },
};
