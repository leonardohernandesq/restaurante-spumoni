import { api } from "@/config/api";
import type { CategoriaComProdutos, Produto } from "@/types/produto";

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const produtoService = {
  /**
   * Cardápio agrupado por categoria (só os pratos de hoje).
   * `incluirInativos` = lista do admin (todos os produtos e dias).
   */
  async listarCardapio(incluirInativos = false): Promise<CategoriaComProdutos[]> {
    const { data } = await api.get<CategoriaComProdutos[]>("/products", {
      params: { all: incluirInativos ? 1 : 0 },
    });
    return data ?? [];
  },

  async buscar(slug: string): Promise<Produto> {
    const { data } = await api.get<Produto>("/product", { params: { slug } });
    return data;
  },

  async criar(form: FormData): Promise<unknown> {
    const { data } = await api.post("/products", form, multipart);
    return data;
  },

  async atualizar(slug: string, form: FormData): Promise<unknown> {
    if (!form.has("slug")) form.append("slug", slug);
    const { data } = await api.put("/products/edit", form, multipart);
    return data;
  },

  /** Liga/desliga o produto no cardápio (a API inverte o estado atual). */
  async alternarAtivo(id: string | number): Promise<unknown> {
    const { data } = await api.put("/product/visible", { id });
    return data;
  },

  async remover(id: string | number): Promise<unknown> {
    const { data } = await api.delete("/products/delete", { data: { id } });
    return data;
  },
};

/** Achata o cardápio em uma lista de produtos, guardando a categoria de cada um. */
export const achatarProdutos = (categorias: CategoriaComProdutos[]): Produto[] =>
  categorias.flatMap((cat) =>
    (cat.products ?? [])
      .filter((produto) => !!produto?.id)
      .map((produto) => ({ ...produto, categoria_id: Number(cat.id) })),
  );
