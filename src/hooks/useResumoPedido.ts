import { useAllFretesQuery } from "@/queries/fretes";
import { calcularTaxaEntrega } from "@/domain/frete";
import { calcularSubtotal, calcularTotalPedido } from "@/domain/pricing";
import { useMemo } from "react";

type ItemCarrinho = {
  /** Preço unitário final, já com atributos (salvo no carrinho). */
  preco?: number;
  quantidade: number;
};

/** Totais do carrinho/checkout, em número (formate só na tela). */
export const useResumoPedido = (
  produtos: ItemCarrinho[],
  bairro: string,
  delivery: "delivery" | "takeaway",
  cidade = "",
) => {
  const { data: fretes = [] } = useAllFretesQuery();

  const taxaEntrega = useMemo(
    () => calcularTaxaEntrega(fretes, cidade, bairro, delivery),
    [fretes, cidade, bairro, delivery],
  );

  const subtotal = useMemo(
    () =>
      calcularSubtotal(
        produtos.map((p) => ({
          precoUnitario: Number(p.preco) || 0,
          quantidade: p.quantidade,
        })),
      ),
    [produtos],
  );

  const valorFinal = useMemo(
    () => calcularTotalPedido(subtotal, taxaEntrega),
    [subtotal, taxaEntrega],
  );

  return { subtotal, taxaEntrega, valorFinal };
};
