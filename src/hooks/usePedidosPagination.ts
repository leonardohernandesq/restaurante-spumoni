import { useMemo, useState } from "react";
import { IPedido } from "@/interfaces/IPedidosData";

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
}

interface UsePedidosPaginationReturn {
  pedidosPaginados: IPedido[];
  pagination: PaginationMeta;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
}

/**
 * Hook de paginação para pedidos.
 *
 * Atualmente pagina no FRONTEND a partir da lista já filtrada.
 *
 * Quando o backend suportar paginação (Opção A), basta:
 *  1. Passar `pedidosFiltrados` como a lista paginada vinda da API
 *  2. Passar `paginationMeta` com os dados reais do backend
 *  3. Remover o `useMemo` de slice interno
 *
 * A interface de retorno (PaginationMeta) já é compatível com o formato
 * esperado do backend: { data, pagination: { total, page, perPage, lastPage } }
 */
export const usePedidosPagination = (
  pedidosFiltrados: IPedido[],
  initialPerPage = 20,
  // -- Opção A: quando o backend paginar, passar esses dados externos --
  // externalPagination?: PaginationMeta,
): UsePedidosPaginationReturn => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  // Quando filtro mudar e a página ficar fora do range, volta para 1
  const total = pedidosFiltrados.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, lastPage);

  // -- Opção A: substituir este useMemo por `pedidosFiltrados` direto (já vem paginado da API) --
  const pedidosPaginados = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return pedidosFiltrados.slice(start, start + perPage);
  }, [pedidosFiltrados, safePage, perPage]);

  const pagination: PaginationMeta = {
    // -- Opção A: substituir por `externalPagination ?? { ... }` --
    page: safePage,
    perPage,
    total,
    lastPage,
  };

  const handleSetPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, lastPage)));
  };

  const handleSetPerPage = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // reset ao mudar perPage
  };

  return {
    pedidosPaginados,
    pagination,
    setPage: handleSetPage,
    setPerPage: handleSetPerPage,
    goToNext: () => handleSetPage(safePage + 1),
    goToPrev: () => handleSetPage(safePage - 1),
  };
};
