import { api } from "@/config/api";
import { IPedidoCreate } from "@/interfaces/IPedidoCreate";
import { IPedido } from "@/interfaces/IPedidosData";

export const fetchPedidosAPI = async (
  after?: string,
  limit = 999
): Promise<IPedido[]> => {
  try {
    const response = await api.get<IPedido[]>("/orders", {
      params: { after, limit, _ts: Date.now() },
      withCredentials: true,
    });
    return response.data ?? [];
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
};

export const insertPedidoApi = async (
  data: IPedidoCreate
): Promise<IPedido> => {
  try {
    const response = await api.post("/orders/create", data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao inserir pedido:", error);
    throw error;
  }
};

export const fetchPedidoById = async (id: number) => {
  try {
    const response = await api.get(`/order?id=${id}&_ts=${Date.now()}`);

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao carregar pedido:", error);
    throw error;
  }
};

export const changeStatusApi = async ({
  id,
  status,
}: {
  id: number;
  status: number;
}) => {
  try {
    const response = await api.put("/order/status", { id, status });

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao alterar status do pedido:", error);
    throw error;
  }
};
