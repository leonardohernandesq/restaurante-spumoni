/**
 * Regra única de preço do site.
 *
 * Preço unitário de um item:
 *   1. começa no preço base do produto;
 *   2. percorre os atributos escolhidos, na ordem:
 *      - "preço incluído" → SUBSTITUI o preço atual pelo preço do atributo
 *        (ex.: tamanho 500ml = R$ 20, já com tudo);
 *      - adicional         → SOMA o preço do atributo.
 *
 * É a regra que o cliente vê ao montar o produto e no checkout.
 * Atenção: o backend calcula `total_produtos` começando de ZERO (ignora o
 * preço base) — ver B7 no PLANO_REFATORACAO.md.
 */

type Numerico = number | string | null | undefined;

export interface AtributoComPreco {
  preco: Numerico;
  /** Vem como boolean (carrinho), 0/1 (API) ou "0"/"1". */
  preco_incluido: boolean | number | string | null | undefined;
}

export const toNumber = (valor: Numerico): number => {
  const n = typeof valor === "number" ? valor : parseFloat(valor ?? "");
  return Number.isFinite(n) ? n : 0;
};

export const isPrecoIncluido = (
  valor: AtributoComPreco["preco_incluido"],
): boolean => valor === true || valor === 1 || valor === "1" || valor === "true";

/** Arredonda para centavos, evitando 0.1 + 0.2 = 0.30000000000000004. */
export const arredondar = (valor: number): number =>
  Math.round((valor + Number.EPSILON) * 100) / 100;

export const calcularPrecoUnitario = (
  precoBase: Numerico,
  atributos: AtributoComPreco[] = [],
): number =>
  arredondar(
    atributos.reduce(
      (preco, attr) =>
        isPrecoIncluido(attr.preco_incluido)
          ? toNumber(attr.preco)
          : preco + toNumber(attr.preco),
      toNumber(precoBase),
    ),
  );

export interface ItemComQuantidade {
  precoUnitario: number;
  quantidade: number;
}

export const calcularTotalItem = ({
  precoUnitario,
  quantidade,
}: ItemComQuantidade): number => arredondar(precoUnitario * quantidade);

export const calcularSubtotal = (itens: ItemComQuantidade[]): number =>
  arredondar(itens.reduce((total, item) => total + calcularTotalItem(item), 0));

export const calcularTotalPedido = (
  subtotal: number,
  taxaEntrega: Numerico,
): number => arredondar(subtotal + toNumber(taxaEntrega));

/** Item de pedido como vem da API (detalhe do pedido). */
interface ProdutoDoPedido {
  preco_base: Numerico;
  quantidade: number;
  atributos?: AtributoComPreco[];
}

/**
 * Totais de um pedido já feito (admin e impressão).
 * A API devolve o preço gravado na venda (B8); pedidos antigos vêm com o preço atual.
 */
export const calcularTotaisDoPedido = <T extends ProdutoDoPedido>(
  produtos: T[],
  taxaEntrega: Numerico,
) => {
  const itens = produtos.map((produto) => {
    const precoUnitario = calcularPrecoUnitario(
      produto.preco_base,
      produto.atributos ?? [],
    );
    return {
      produto,
      precoUnitario,
      total: calcularTotalItem({ precoUnitario, quantidade: produto.quantidade }),
    };
  });

  const subtotal = calcularSubtotal(
    itens.map(({ precoUnitario, produto }) => ({
      precoUnitario,
      quantidade: produto.quantidade,
    })),
  );

  return {
    itens,
    subtotal,
    taxaEntrega: toNumber(taxaEntrega),
    total: calcularTotalPedido(subtotal, taxaEntrega),
  };
};
