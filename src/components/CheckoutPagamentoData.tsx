import { formatCurrencyBRL } from "@/utils/format";

export const CheckoutPagamentoData = ({
  forma_pagamento,
  troco,
  nota_fiscal,
}: {
  forma_pagamento?: string;
  troco?: number;
  nota_fiscal?: string;
}) => (
  <div className="flex flex-col border-t border-zinc-300 px-4 py-2">
    <h2 className="font-bold text-purple-principal-700 text-lg">
      Dados de pagamento
    </h2>
    <p className="uppercase">
      <strong>Pagamento:</strong> {forma_pagamento}
    </p>
    {troco !== undefined && troco > 0 && (
      <p>
        <strong>Precisa de troco?</strong> {formatCurrencyBRL(troco)}
      </p>
    )}
    {nota_fiscal && (
      <p>
        <strong>Nota Fiscal:</strong> {nota_fiscal}
      </p>
    )}
  </div>
);
