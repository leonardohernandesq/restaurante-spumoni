import { api } from "@/config/api";
import type {
  Categoria,
  CategoriaCreateDto,
  CategoriaUpdateDto,
} from "@/types/categoria";

export const categoriaService = {
  async listar(): Promise<Categoria[]> {
    const { data } = await api.get<Categoria[]>("/category");
    return data ?? [];
  },

  async buscar(id: number): Promise<Categoria> {
    const { data } = await api.get<Categoria>("/categoryId", { params: { id } });
    return data;
  },

  async criar({ nome, slug, descricao }: CategoriaCreateDto): Promise<unknown> {
    const { data } = await api.post("/category/create", { nome, slug, descricao });
    return data;
  },

  async atualizar({ id, nome, slug, descricao }: CategoriaUpdateDto): Promise<unknown> {
    const { data } = await api.put("/category/edit", { id, nome, slug, descricao });
    return data;
  },

  async remover(id: number): Promise<unknown> {
    const { data } = await api.delete("/category/delete", { data: { id } });
    return data;
  },
};
