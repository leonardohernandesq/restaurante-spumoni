import { create } from "zustand";
import {
  FretePagination,
  freteService,
  FreteApiResponse,
} from "@/services/frete";

export interface Frete {
  id?: number;
  bairro: string;
  preco: string;
  cidade: string;
}

interface FreteStore {
  fretes: Frete[];
  pagination: FretePagination;
  setFretes: (data: Frete[], pagination: FretePagination) => void;
  fetchFretes: (page?: number, perPage?: number) => Promise<FreteApiResponse>;
  createFrete: (data: Frete) => Promise<Frete>;
  updateFrete: (id: number, data: Frete) => Promise<void>;
  deleteFrete: (id: number) => Promise<void>;
}

export const useFreteStore = create<FreteStore>((set) => ({
  fretes: [],
  setFretes: (data: Frete[], pagination: FretePagination) =>
    set({ fretes: data, pagination }),
  pagination: { currentPage: 1, perPage: 10, total: 0, totalPages: 1 },
  // Buscar todos os fretes
  fetchFretes: async (
    page: number = 1,
    perPage: number = 100,
  ): Promise<FreteApiResponse> => {
    const response = await freteService.getAll(page, perPage);
    set({ fretes: response.data, pagination: response.pagination });
    return response; // retorna { data, pagination }
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
