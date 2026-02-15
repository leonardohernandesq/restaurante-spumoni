import { useAppQuery } from "@/hooks/useAppQuery";
import { fetchPedidoById } from "@/services/pedido";
import { IPedido } from "@/interfaces/IPedidosData";

export const usePedidoByIdQuery = (id: number) => {
  return useAppQuery<IPedido, Error>({
    queryKey: ["pedido", id],
    queryFn: () => fetchPedidoById(id),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
