import { api } from "@/config/api";
import type { Frete, FreteApiResponse } from "@/types/frete";

export const freteService = {
  /** Uma página de fretes: `{ data, pagination }`. */
  async listar(page = 1, perPage = 10): Promise<FreteApiResponse> {
    const { data } = await api.get<FreteApiResponse>("/fretes", {
      params: { page, perPage },
    });
    return data;
  },

  async criar(frete: Frete): Promise<Frete> {
    const { data } = await api.post<Frete>("/fretes", frete);
    return data;
  },

  async atualizar(id: number, frete: Frete): Promise<unknown> {
    const { data } = await api.put("/frete/edit", frete, { params: { id } });
    return data;
  },

  async remover(id: number): Promise<unknown> {
    const { data } = await api.delete("/frete/delete", { data: { id } });
    return data;
  },
};
