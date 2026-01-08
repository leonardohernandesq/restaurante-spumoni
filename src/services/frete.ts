// services/freteService.ts
import { api } from "@/config/api";

export interface Frete {
  id?: number;
  bairro: string;
  preco: string;
  cidade: string;
}

export interface FretePagination {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface FreteApiResponse {
  data: Frete[];
  pagination: FretePagination;
}

export const freteService = {
  // Buscar todos os fretes
  async getAll(
    page: number = 1,
    perPage: number = 10
  ): Promise<FreteApiResponse> {
    // Usar GET com query params (ajustável conforme backend)
    const response = await api.get("/fretes", { params: { page, perPage } });
    return response.data; // já retorna { data, pagination }
  },

  // Criar novo frete
  async create(payload: Frete): Promise<Frete> {
    const { data } = await api.post("/fretes", payload);
    return data; // deve retornar o frete com ID
  },

  // Atualizar frete por ID
  async update(id: number, payload: Frete): Promise<void> {
    await api.put(`/frete/edit/${id}`, payload);
  },

  // Deletar frete por ID
  async delete(id: number): Promise<void> {
    const res = await api.delete("/frete/delete", { data: { id } });

    return res.data;
  },
};
