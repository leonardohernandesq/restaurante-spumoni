import { describe, expect, it } from "vitest";
import { achatarProdutos } from "./produto";
import type { CategoriaComProdutos, Produto } from "@/types/produto";

const produto = (id: number, nome: string) =>
  ({ id, name: nome, slug: nome.toLowerCase() }) as Produto;

describe("achatarProdutos", () => {
  it("junta os produtos de todas as categorias com o id numérico da categoria", () => {
    const cardapio = [
      { id: "3", category: "Marmitex", descriptionCategory: "", products: [produto(1, "A"), produto(2, "B")] },
      { id: "7", category: "Bebidas", descriptionCategory: "", products: [produto(3, "C")] },
    ] as CategoriaComProdutos[];

    const lista = achatarProdutos(cardapio);
    expect(lista.map((p) => [p.id, p.categoria_id])).toEqual([
      [1, 3],
      [2, 3],
      [3, 7],
    ]);
  });

  it("ignora categorias sem produtos e itens sem id", () => {
    const cardapio = [
      { id: "1", category: "Vazia", descriptionCategory: "", products: [] },
      { id: "2", category: "X", descriptionCategory: "", products: [null, produto(9, "Z")] },
      { id: "3", category: "Sem lista", descriptionCategory: "" },
    ] as unknown as CategoriaComProdutos[];

    expect(achatarProdutos(cardapio).map((p) => p.id)).toEqual([9]);
  });
});
