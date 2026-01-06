import { create } from "zustand";
import { freteService } from "@/services/frete";

export interface Frete {
  id?: number;
  bairro: string;
  preco: string;
}

interface FreteStore {
  fretes: Frete[];
  setFretes: (data: Frete[]) => void;
  fetchFretes: () => Promise<Frete[]>;
  createFrete: (data: Frete) => Promise<Frete>;
  updateFrete: (id: number, data: Frete) => Promise<void>;
  deleteFrete: (id: number) => Promise<void>;
}

export const useFreteStore = create<FreteStore>((set) => ({
  fretes: [],

  setFretes: (data: Frete[]) => set({ fretes: data }),

  // Buscar todos os fretes
  fetchFretes: async () => {
    const data = await freteService.getAll();
    set({ fretes: data });
    return data;
  },

  // Criar um novo frete
  createFrete: async (data: Frete): Promise<Frete> => {
    const created = await freteService.create(data);
    set((state) => ({ fretes: [...state.fretes, created] }));
    return created;
  },

  // Atualizar frete por ID
  updateFrete: async (id: number, data: Frete) => {
    await freteService.update(id, data);
    set((state) => ({
      fretes: state.fretes.map((f) => (f.id === id ? { ...f, ...data } : f)),
    }));
  },

  // Deletar frete
  deleteFrete: async (id: number) => {
    await freteService.delete(id);
    set((state) => ({
      fretes: state.fretes.filter((f) => f.id !== id),
    }));
  },
}));
