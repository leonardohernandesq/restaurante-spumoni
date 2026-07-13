import { useFreteStore } from "@/store/freteStore";
import { useEffect, useMemo } from "react";

type ProdutoCarrinho = {
  preco?: number;
  quantidade: number;
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

  const subtotal = useMemo(() => {
    // Regra única: o carrinho já salva `preco` final do item.
    // Para manter consistência com `src/app/carrinho/page.tsx`,
    // não recalculamos atributos aqui.
    return produtos
      .reduce(
        (acc, produto) => acc + (Number(produto.preco) || 0) * produto.quantidade,
        0,
      )
      .toFixed(2);
  }, [produtos]);

  const valorFinal = useMemo(() => {
    return (parseFloat(subtotal) + taxaEntrega).toFixed(2);
  }, [subtotal, taxaEntrega]);

  return { subtotal, taxaEntrega, valorFinal };
};
