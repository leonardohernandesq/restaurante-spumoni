import { api } from '@/config/api';

// Tipagem correta do pedido que vem do backend
export interface Pedido {
  id: string;
  client_name: string;
  client_phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  // adicione aqui outros campos se houver
}

/**
 * Busca os pedidos da API.
 * Se `after` for fornecido, retorna apenas os pedidos novos.
 */
export const getPedidos = async (after?: string): Promise<Pedido[]> => {
  try {
    const response = await api.get<Pedido[]>('/orders', {
      params: after ? { after } : {},
      withCredentials: true,
    });

    return response.data ?? []; // Garante que nunca retorna undefined
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return []; // Retorna array vazio em caso de erro
  }
};
