import { api } from '@/config/api';
import { IPedido, IPedidosData } from '@/interfaces/IPedidosData';


export const fetchPedidosAPI = async (after?: string): Promise<IPedido[]> => {
  try {
    const response = await api.get<IPedido[]>('/orders', {
      params: after ? { after } : {},
      withCredentials: true,
    });

    return response.data ?? [];
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
};


export const insertPedidoApi = async (data: IPedido): Promise<IPedido> => {
  try {
    const response = await api.post('/orders/create', data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao inserir pedido:', error);
    throw error; // importante propagar o erro
  }
};
