import { create } from 'zustand';
import { fetchPedidosAPI, insertPedidoApi } from '@/services/pedido';
import { IPedido } from '@/interfaces/IPedidosData';

interface PedidoStore {
  pedidos: IPedido[];
  getPedidos: () => Promise<void>;
  setPedidos: (pedidos: IPedido[]) => void;
  insertPedido: (data: IPedido) => Promise<void>;
}

export const pedidoStore = create<PedidoStore>((set, get) => ({
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
  insertPedido: async (data: IPedido) => {
    try {
      const novoPedido = await insertPedidoApi(data);
      const pedidosAtuais = get().pedidos;
      set({ pedidos: [...pedidosAtuais, novoPedido] });
    } catch (error) {
      console.error('❌ Erro ao inserir pedido:', error);
      throw error;
    }
  }
}));
