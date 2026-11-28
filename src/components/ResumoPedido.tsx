"use client";

import { formatCurrencyBRL } from "@/utils/format";

interface ResumoPedidoProps {
  produtosLength: number;
  subtotal: number;
  taxaEntrega: number;
  valorFinal: number;
}

export const ResumoPedido = ({
  produtosLength,
  subtotal,
  taxaEntrega,
  valorFinal,
}: ResumoPedidoProps) => {
  return (
    <section className="text-zinc-700">
      <p className="text-sm">RESUMO</p>
      <div className="flex justify-between items-center my-2 text-sm">
        <p>{produtosLength === 1 ? "1 Item" : `${produtosLength} Itens`}</p>
        <p>{formatCurrencyBRL(subtotal)}</p>
      </div>
      <div className="flex justify-between items-center my-2 text-sm">
        <p>Entrega</p>
        <p>{formatCurrencyBRL(taxaEntrega)}</p>
      </div>
      <div className="flex justify-between items-center my-2 text-sm">
        <p>Total</p>
        <p>{formatCurrencyBRL(valorFinal)}</p>
      </div>
    </section>
  );
};

export default ResumoPedido;
