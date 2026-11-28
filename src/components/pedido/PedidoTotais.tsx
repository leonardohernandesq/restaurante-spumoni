import { FiShoppingCart } from "react-icons/fi";
import type { PedidoItem } from "@/types/pedido";
import { Cartao } from "@/components/admin/Cartao";
import { formatCurrencyBRL } from "@/utils/format";

interface ItemComTotal {
  produto: PedidoItem;
  precoUnitario: number;
  total: number;
}

interface PedidoTotaisProps {
  itens: ItemComTotal[];
  subtotal: number;
  taxaEntrega: number;
  total: number;
  entrega: boolean;
  carregando?: boolean;
}

/** Itens do pedido (com opções e observação) e a conta: produtos, entrega e total. */
export const PedidoTotais = ({ itens, subtotal, taxaEntrega, total, entrega, carregando }: PedidoTotaisProps) => {
  const quantidade = itens.reduce((soma, { produto }) => soma + Number(produto.quantidade || 0), 0);

  return (
    <Cartao
      className="h-full"
      icone={<FiShoppingCart />}
      titulo="Itens"
      descricao={carregando ? "Carregando itens..." : `${quantidade} ${quantidade === 1 ? "item" : "itens"}`}
    >
      {itens.length > 0 && (
        <ul className="divide-y divide-zinc-100">
          {itens.map(({ produto, precoUnitario, total: totalItem }) => (
            <li key={produto.id} className="flex gap-3 py-3 first:pt-0">
              <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 px-2 font-bold tabular-nums text-zinc-800">
                {produto.quantidade}×
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-zinc-900">{produto.produto_nome}</p>
                  <p className="shrink-0 text-right font-semibold tabular-nums text-zinc-900">
                    {formatCurrencyBRL(totalItem)}
                    {Number(produto.quantidade) > 1 && (
                      <span className="block text-xs font-normal text-zinc-500">
                        {formatCurrencyBRL(precoUnitario)} cada
                      </span>
                    )}
                  </p>
                </div>

                {produto.atributos.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-0.5 text-sm text-zinc-600">
                    {produto.atributos.map((attr) => (
                      <li key={attr.id}>
                        <span className="text-zinc-500">{attr.nome_atributo}:</span> {attr.valor}
                        {attr.preco > 0 && (
                          <span className="text-zinc-400"> ({formatCurrencyBRL(attr.preco)})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {produto.observacao && (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    <strong className="font-semibold">Obs.:</strong> {produto.observacao}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!carregando && (
        <dl className="mt-2 flex flex-col gap-1.5 border-t border-zinc-200 pt-4 text-sm">
          <div className="flex justify-between text-zinc-600">
            <dt>Produtos</dt>
            <dd className="tabular-nums">{formatCurrencyBRL(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-zinc-600">
            <dt>Entrega</dt>
            <dd className="tabular-nums">{entrega ? formatCurrencyBRL(taxaEntrega) : "Retirada"}</dd>
          </div>
          <div className="mt-1 flex justify-between text-lg font-bold text-zinc-900">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatCurrencyBRL(total)}</dd>
          </div>
        </dl>
      )}
    </Cartao>
  );
};
