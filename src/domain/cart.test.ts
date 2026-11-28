import { beforeEach, describe, expect, it } from "vitest";
import { buildCartItemKey } from "./cart";
import { cartStore } from "@/store/cartStore";
import type { NovoProdutoCarrinho } from "@/types/carrinho";

const acai = (
  overrides: Partial<NovoProdutoCarrinho> = {},
): NovoProdutoCarrinho => ({
  id: 10,
  nome: "Açaí",
  slug: "acai",
  imagem: "acai.png",
  quantidade: 1,
  preco: 20,
  observacoes: "",
  atributos: [
    {
      nome: "Tamanho",
      valor: "500ml",
      preco: 20,
      atributo_id: 1,
      valor_atributo_id: 101,
      preco_incluido: true,
    },
  ],
  ...overrides,
});

describe("buildCartItemKey", () => {
  it("ignora a ordem dos atributos", () => {
    expect(buildCartItemKey(1, [3, 1, 2])).toBe(buildCartItemKey(1, [1, 2, 3]));
  });

  it("ignora maiúsculas e espaços nas pontas da observação", () => {
    expect(buildCartItemKey(1, [1], "  Sem Gelo ")).toBe(
      buildCartItemKey(1, [1], "sem gelo"),
    );
  });

  it("diferencia produto, atributos e observação", () => {
    const base = buildCartItemKey(1, [1], "");
    expect(buildCartItemKey(2, [1], "")).not.toBe(base);
    expect(buildCartItemKey(1, [2], "")).not.toBe(base);
    expect(buildCartItemKey(1, [1], "sem açúcar")).not.toBe(base);
  });
});

describe("cartStore", () => {
  beforeEach(() => {
    cartStore.getState().limparCarrinho();
  });

  it("soma a quantidade quando a variação é a mesma", () => {
    const { adicionarProduto } = cartStore.getState();
    adicionarProduto(acai());
    adicionarProduto(acai({ quantidade: 2 }));

    const { produtos } = cartStore.getState();
    expect(produtos).toHaveLength(1);
    expect(produtos[0].quantidade).toBe(3);
  });

  it("cria item separado quando o atributo é diferente", () => {
    const { adicionarProduto } = cartStore.getState();
    adicionarProduto(acai());
    adicionarProduto(
      acai({
        preco: 15,
        atributos: [
          {
            nome: "Tamanho",
            valor: "300ml",
            preco: 15,
            atributo_id: 1,
            valor_atributo_id: 102,
            preco_incluido: true,
          },
        ],
      }),
    );

    const { produtos } = cartStore.getState();
    expect(produtos).toHaveLength(2);
    expect(produtos.map((p) => p.preco)).toEqual([20, 15]);
  });

  it("cria item separado quando a observação é diferente", () => {
    const { adicionarProduto } = cartStore.getState();
    adicionarProduto(acai());
    adicionarProduto(acai({ observacoes: "sem granola" }));

    expect(cartStore.getState().produtos).toHaveLength(2);
  });

  it("remove e atualiza só a variação escolhida", () => {
    const { adicionarProduto } = cartStore.getState();
    adicionarProduto(acai());
    adicionarProduto(acai({ observacoes: "sem granola" }));

    const [primeiro, segundo] = cartStore.getState().produtos;

    cartStore.getState().atualizarQuantidade(segundo.itemId, 5);
    expect(cartStore.getState().produtos.map((p) => p.quantidade)).toEqual([
      1, 5,
    ]);

    cartStore.getState().removerProduto(primeiro.itemId);
    const restantes = cartStore.getState().produtos;
    expect(restantes).toHaveLength(1);
    expect(restantes[0].itemId).toBe(segundo.itemId);
  });
});
