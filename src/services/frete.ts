// services/freteService.ts
import { api } from "@/config/api";

export interface Frete {
  id?: number;
  bairro: string;
  preco: string;
}

export const freteService = {
  // Buscar todos os fretes
  async getAll(): Promise<Frete[]> {
    const { data } = await api.get("/fretes"); // rota do backend
    return data;
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
