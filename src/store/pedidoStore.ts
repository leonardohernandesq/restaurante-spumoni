import { create } from 'zustand';
import { getPedidos as fetchPedidosAPI } from '@/services/pedido';

interface Pedido {
  id: string;
  client_name: string;
  client_phone: string;
  status: string;
  created_at: string;
}

interface PedidoStore {
  pedidos: Pedido[];
  getPedidos: () => Promise<void>;
  setPedidos: (pedidos: Pedido[]) => void;
}

export const usePedidoStore = create<PedidoStore>((set) => ({
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
}));
