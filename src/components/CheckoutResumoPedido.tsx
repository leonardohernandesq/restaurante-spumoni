import { formatCurrencyBRL } from "@/utils/format";

export const CheckoutResumoPedido = ({
  total_produtos,
  total_entrega,
  valor_total,
}: {
  total_produtos?: number;
  total_entrega?: number;
  valor_total?: number;
}) => (
  <div className="flex flex-col border-t border-zinc-300 px-4 py-2">
    <h2 className="font-bold text-purple-principal-700 text-lg">
      Detalhes do pedido
    </h2>
    <p className="px-1 text-sm">
      <strong>Valor produtos:</strong> {formatCurrencyBRL(total_produtos ?? 0)}
    </p>
    <p className="px-1 text-sm">
      <strong>Valor entrega:</strong> {formatCurrencyBRL(total_entrega ?? 0)}
    </p>
    <p className="px-1 text-lg font-bold text-green-principal-700">
      <strong>Valor total:</strong> {formatCurrencyBRL(valor_total ?? 0)}
    </p>
  </div>
);
