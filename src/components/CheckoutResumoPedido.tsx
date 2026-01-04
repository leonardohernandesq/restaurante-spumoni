import { formatCurrencyBRL } from "@/utils/validators";

export const CheckoutResumoPedido = ({
  total_produtos,
  total_entrega,
  valor_total,
}: {
  total_produtos?: string;
  total_entrega?: string;
  valor_total?: string;
}) => (
  <div className="flex flex-col border-t border-zinc-300 px-4 py-2">
    <h2 className="font-bold text-purple-principal-700 text-lg">
      Detalhes do pedido
    </h2>
    <p className="px-1 text-sm">
      <strong>Valor produtos:</strong>
      {formatCurrencyBRL(Number(total_produtos))}
    </p>
    <p className="px-1 text-sm">
      <strong>Valor entrega:</strong> {formatCurrencyBRL(Number(total_entrega))}
    </p>
    <p className="px-1 text-lg font-bold text-green-principal-700">
      <strong>Valor total:</strong> {formatCurrencyBRL(Number(valor_total))}
    </p>
  </div>
);
