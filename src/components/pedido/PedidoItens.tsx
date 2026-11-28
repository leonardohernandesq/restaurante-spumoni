import type { PedidoItem } from "@/types/pedido";
import { formatCurrencyBRL } from "@/utils/format";

export interface ItemDoPedido {
  produto: PedidoItem;
  /** Total do item (preço x quantidade). Sem ele, não mostra subtotal. */
  total?: number;
}

interface PedidoItensProps {
  itens: ItemDoPedido[];
  /** Mostra preço dos atributos e subtotal (admin e impressão). */
  mostrarPrecos?: boolean;
}

/** Lista de itens de um pedido: admin, impressão e resumo do cliente. */
export const PedidoItens = ({ itens, mostrarPrecos = true }: PedidoItensProps) => (
  <div className="divide-y divide-zinc-300">
    {itens.map(({ produto, total }) => (
      <div key={produto.id} className="py-2 px-1">
        <h2 className="font-medium mb-2">
          {produto.quantidade}x - {produto.produto_nome}
        </h2>

        {produto.atributos.length > 0 && (
          <div className="ml-4 mb-2 text-sm text-zinc-700">
            {produto.atributos.map((attr) => (
              <p key={attr.id}>
                • <strong>{attr.nome_atributo}:</strong> {attr.valor}
                {mostrarPrecos &&
                  attr.preco > 0 &&
                  ` (${formatCurrencyBRL(attr.preco)})`}
              </p>
            ))}
          </div>
        )}

        {produto.observacao && (
          <p>
            <strong>Obs.:</strong> {produto.observacao}
          </p>
        )}

        {mostrarPrecos && total !== undefined && (
          <p className="font-bold mt-1">Subtotal: {formatCurrencyBRL(total)}</p>
        )}
      </div>
    ))}
  </div>
);
