import { useSettingsQuery } from "@/queries/config";
import type { Pedido } from "@/types/pedido";
import { formatCurrencyBRL } from "@/utils/format";
import { getFormaPagamentoLabel } from "@/domain/pedidoStatus";
import { calcularTotaisDoPedido } from "@/domain/pricing";
import { formatDateTimeBR } from "@/domain/datetime";
import { LOJA } from "@/constants/app";
import { PedidoItens } from "@/components/pedido/PedidoItens";

export const Printer = ({ pedido }: { pedido: Pedido | null }) => {
  const { data: settings } = useSettingsQuery();

  const totais = pedido
    ? calcularTotaisDoPedido(pedido.produtos ?? [], pedido.taxa_entrega)
    : null;

  return (
    <div id="print-area" className="hidden print:block text-md font-mono p-4">
      <h2 className="text-center font-bold text-base">{LOJA.nome}</h2>
      <p>CNPJ: {LOJA.cnpj}</p>
      <hr className="my-2" />
      <p>
        {pedido?.id && (
          <>
            <strong>Pedido:</strong> {pedido.id} -{" "}
          </>
        )}
        {formatDateTimeBR(pedido?.data_pedido)}

        {pedido?.data_entrega && (
          <>
            {" "}
            <strong>Entrega agendada:</strong>{" "}
            {formatDateTimeBR(pedido.data_entrega)}
          </>
        )}
      </p>
      <p>
        <strong>Cliente:</strong> {pedido?.nome_cliente} - {pedido?.telefone}
      </p>
      <strong>Endereço:</strong>{" "}
      {pedido?.tipo_entrega === "delivery" ? (
        <p>
          {pedido?.endereco_entrega}, {pedido?.numero} {pedido?.complemento} -{" "}
          {pedido?.bairro} - {pedido?.cep} - {pedido?.referencia}
        </p>
      ) : (
        <p>Retirada - Endereço: {settings?.address}</p>
      )}
      <hr className="my-2" />
      {pedido && totais && (
        <>
          <PedidoItens itens={totais.itens} />
          <p>
            <strong>Forma de pagamento:</strong>{" "}
            {getFormaPagamentoLabel(pedido.forma_pagamento)}
          </p>
          <hr className="my-2" />
          <p className="text-right font-semibold">
            Entrega: {formatCurrencyBRL(totais.taxaEntrega)}
          </p>
          <p className="text-right font-semibold">
            Total: {formatCurrencyBRL(totais.total)}
          </p>
        </>
      )}
      <p className="text-center mt-4">Obrigado pela preferência!</p>
      <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-area, #print-area * {
                        visibility: visible;
                    }
                    #print-area {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translate(-50%, 0%);
                        width: ${settings?.tamanho_bobina};
                        padding: 10px;
                    }
                }
            `}</style>
    </div>
  );
};
