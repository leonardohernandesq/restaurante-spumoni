import { useMemo } from "react";

type ProdutoCarrinho = {
  preco?: number;
  quantidade: number;
  atributos: {
    preco: number;
    preco_incluido?: boolean;
  }[];
};

export const useResumoPedido = (
  produtos: ProdutoCarrinho[],
  bairro: string,
  delivery: "delivery" | "takeaway"
) => {
  const taxaEntrega = useMemo(() => {
    if (delivery === "takeaway") return 0;

    if (bairro.toLowerCase() === "unhos") return 3.5;
    if (bairro.toLowerCase() === "sao joao da talha") return 5.0;
    if (bairro.toLowerCase() === "sacavem") return 6.0;
    if (bairro.toLowerCase() === "portela") return 7.0;
    if (bairro.toLowerCase() === "olivais") return 8.0;

    return 0;
  }, [delivery, bairro]);

  const calcularPrecoProduto = (produto: ProdutoCarrinho) => {
    let precoBase = 0;

    for (const attr of produto.atributos || []) {
      if (attr.preco_incluido) {
        precoBase = attr.preco;
      } else {
        precoBase += attr.preco;
      }
    }

    return precoBase * produto.quantidade;
  };

  const subtotal = useMemo(() => {
    return produtos
      .reduce((acc, produto) => acc + calcularPrecoProduto(produto), 0)
      .toFixed(2);
  }, [produtos]);

  const valorFinal = useMemo(() => {
    return (parseFloat(subtotal) + taxaEntrega).toFixed(2);
  }, [subtotal, taxaEntrega]);

  return { subtotal, taxaEntrega, valorFinal };
};
