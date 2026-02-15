import { useAppQuery } from "@/hooks/useAppQuery";
import { fetchPedidosAPI } from "@/services/pedido";
import { IPedido } from "@/interfaces/IPedidosData";

export const usePedidosQuery = () => {
  return useAppQuery<IPedido[], Error>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const pedidos = await fetchPedidosAPI(); // sem "after", pega todos
      return pedidos.map((p) => ({ ...p, status: Number(p.status) }));
    },
    staleTime: 1000 * 60, // 1 minuto
    refetchOnWindowFocus: false,
    refetchInterval: 5000, // polling a cada 5s
  });
};
