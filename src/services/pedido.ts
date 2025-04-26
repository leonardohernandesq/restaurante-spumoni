import { api } from '@/config/api';

export interface Pedido {
  id: string;
  client_name: string;
  client_phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}


export const getPedidos = async (after?: string): Promise<Pedido[]> => {
  try {
    const response = await api.get<Pedido[]>('/orders', {
      params: after ? { after } : {},
      withCredentials: true,
    });

    return response.data ?? [];
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
};
