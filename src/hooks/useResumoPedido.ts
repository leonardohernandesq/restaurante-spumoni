import { useFreteStore } from "@/store/freteStore";
import { useEffect, useMemo } from "react";

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
  delivery: "delivery" | "takeaway",
) => {
  const { fetchFretes, fretes } = useFreteStore();

  useEffect(() => {
    fetchFretes();
  }, [fetchFretes]);

  const taxaEntrega = useMemo(() => {
    if (delivery === "takeaway") return 0;

    const freteEncontrado = fretes.find(
      (frete) => frete.bairro.toLowerCase() === bairro.toLowerCase(),
    );
    if (freteEncontrado) {
      return parseFloat(freteEncontrado.preco);
    }

    return 0;
  }, [delivery, bairro, fretes]);

  const calcularPrecoProduto = (produto: ProdutoCarrinho) => {
    let precoBase = produto.preco || 0;

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
