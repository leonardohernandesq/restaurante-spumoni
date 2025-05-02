import { create } from 'zustand';
import { fetchPedidoById, fetchPedidosAPI, insertPedidoApi } from '@/services/pedido';
import { IPedido, IPedidoCompleto } from '@/interfaces/IPedidosData';

interface PedidoStore {
  pedido: IPedidoCompleto | null;
  pedidos: IPedido[];
  getPedidos: () => Promise<void>;
  setPedidos: (pedidos: IPedido[]) => void;
  insertPedido: (data: IPedido) => Promise<number>;
  getPedidoById: (pedido_id: number) => void;
}

export const pedidoStore = create<PedidoStore>((set, get) => ({
  pedido: null,
  pedidos: [],
  setPedidos: (pedidos) => set({ pedidos }),
  getPedidos: async () => {
    try {
      const data = await fetchPedidosAPI();
      set({ pedidos: data });
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error);
    }
  },
  insertPedido: async (data: IPedido): Promise<number> => {
    try {
      const novoPedido = await insertPedidoApi(data);
      const pedidosAtuais = get().pedidos;
      set({ pedidos: [...pedidosAtuais, novoPedido] });

      return novoPedido.pedido_id!;
    } catch (error) {
      console.error('❌ Erro ao inserir pedido:', error);
      throw error;
    }
  },
  getPedidoById: async (id: number) => {
    try {
      const data = await fetchPedidoById(id);
      set({ pedido: data });
    } catch (error) {

    }
  }
}));
