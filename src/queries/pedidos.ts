import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { pedidoService } from "@/services/pedido";
import type {
  PedidoCreateDto,
  PedidosFiltro,
  PedidosPagina,
} from "@/types/pedido";
import { DEFAULT_PER_PAGE, REFETCH_PEDIDOS_MS } from "@/constants/app";
import { queryKeys } from "./keys";

/**
 * Uma página do gestor de pedidos (paginação e filtros no servidor), com
 * polling. Ao trocar de página/filtro, mantém a anterior na tela até chegar.
 */
export const usePedidosQuery = (filtro: PedidosFiltro) =>
  useQuery({
    queryKey: queryKeys.pedidos.list(filtro),
    queryFn: () => pedidoService.listar(filtro),
    refetchInterval: REFETCH_PEDIDOS_MS,
    placeholderData: keepPreviousData,
  });

/** Página 1 sem filtros: onde todo pedido novo aparece primeiro. */
export const FILTRO_PEDIDOS_RECENTES: PedidosFiltro = {
  page: 1,
  perPage: DEFAULT_PER_PAGE,
  status: [],
  busca: "",
  excluidos: false,
};

/**
 * Pedidos mais recentes, para o alerta sonoro funcionar mesmo com o admin
 * em outra página ou filtrando. Quando a tela já está na página 1 sem
 * filtros, é a mesma query (o React Query não busca duas vezes).
 */
export const usePedidosRecentesQuery = () =>
  usePedidosQuery(FILTRO_PEDIDOS_RECENTES);

/**
 * Detalhe de um pedido. Enquanto carrega, mostra o que já existe na lista
 * (nome, telefone, status...) para a tela abrir instantaneamente.
 */
export const usePedidoQuery = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.pedidos.detail(id),
    queryFn: () => pedidoService.buscar(id),
    enabled: Number.isInteger(id) && id > 0,
    placeholderData: () =>
      queryClient
        .getQueriesData<PedidosPagina>({ queryKey: queryKeys.pedidos.lists })
        .flatMap(([, pagina]) => pagina?.data ?? [])
        .find((p) => p.id === id),
  });
};

/** Cria o pedido e devolve o número dele (0 se a API não devolver). */
export const useCreatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: PedidoCreateDto): Promise<number> => {
      const criado = await pedidoService.criar(dados);
      const pedidoId = Number(criado.pedido_id ?? criado.id);

      // O pedido JÁ foi criado: não lançar erro aqui (o cliente tentaria de
      // novo e duplicaria o pedido). A API devolve { pedido_id } com 201.
      if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
        console.warn("Pedido criado, mas a API não devolveu o número", criado);
        return 0;
      }
      return pedidoId;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all }),
  });
};

/** Exclui ou restaura um pedido (lista, detalhe e estatísticas mudam). */
export const useMarcarPedidoExcluido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, excluido }: { id: number; excluido: boolean }) =>
      pedidoService.marcarExcluido(id, excluido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all });
      queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
    },
  });
};

export const useChangePedidoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      pedidoService.alterarStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all }),
  });
};
