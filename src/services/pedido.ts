import { api } from "@/config/api";
import { mapPedidoApi } from "@/services/mappers/pedido";
import type {
  Pedido,
  PedidoApi,
  PedidoCreateDto,
  PedidosFiltro,
  PedidosPagina,
  PedidosPaginaApi,
} from "@/types/pedido";

/** Resposta do POST /orders/create (só o id importa para o front). */
export interface PedidoCriadoApi {
  pedido_id?: number | string;
  id?: number | string;
}

// `_ts` evita que o navegador/CDN devolva uma lista antiga (polling do admin)
const semCache = () => ({ _ts: Date.now() });

export const pedidoService = {
  /** Uma página da lista, com filtros aplicados no servidor. */
  async listar({ page, perPage, status, busca, excluidos }: PedidosFiltro): Promise<PedidosPagina> {
    const { data } = await api.get<PedidosPaginaApi>("/orders", {
      params: {
        paginado: 1,
        page,
        perPage,
        status: status.length ? status.join(",") : undefined,
        excluidos: excluidos ? 1 : undefined,
        busca: busca.trim() || undefined,
        ...semCache(),
      },
    });
    return {
      data: (data?.data ?? []).map(mapPedidoApi),
      pagination: data?.pagination ?? { page, perPage, total: 0, lastPage: 1 },
      contagem: data?.contagem
        ? {
            status: Object.fromEntries(
              Object.entries(data.contagem.status).map(([s, n]) => [Number(s), Number(n)]),
            ),
            excluidos: Number(data.contagem.excluidos) || 0,
          }
        : undefined,
    };
  },

  async buscar(id: number): Promise<Pedido> {
    const { data } = await api.get<PedidoApi>("/order", {
      params: { id, ...semCache() },
    });
    return mapPedidoApi(data);
  },

  async criar(pedido: PedidoCreateDto): Promise<PedidoCriadoApi> {
    const { data } = await api.post<PedidoCriadoApi>("/orders/create", pedido);
    return data;
  },

  /** Exclui (ou restaura) o pedido. Não muda o status. */
  async marcarExcluido(id: number, excluido: boolean): Promise<unknown> {
    const { data } = await api.put("/order/excluido", { id, excluido });
    return data;
  },

  async alterarStatus(id: number, status: number): Promise<unknown> {
    const { data } = await api.put("/order/status", { id, status });
    return data;
  },
};
