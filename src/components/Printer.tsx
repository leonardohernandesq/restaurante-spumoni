import { useSettingsQuery } from "@/hooks/useSettingsQuery";
import { IPedido } from "@/interfaces/IPedidosData";
import { formatCurrencyBRL } from "@/utils/validators";

export const Printer = ({ pedido }: { pedido: IPedido | null }) => {
  const { data: settings } = useSettingsQuery();

  return (
    <div id="print-area" className="hidden print:block text-md font-mono p-4">
      <h2 className="text-center font-bold text-base">Restaurante Spumoni</h2>
      <p>CNPJ: 27.417.449/0001-06</p>
      <hr className="my-2" />
      <p>
        <strong>Cliente:</strong> {pedido?.nome_cliente}
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
      {pedido?.produtos.map((produto, index) => {
        const calcularPrecoProduto = () => {
          let precoBase = produto.preco_base;

          const attrQueSubstituiBase = produto.atributos?.find(
            (attr) => attr.preco_incluido === 1,
          );
          if (attrQueSubstituiBase) {
            precoBase = attrQueSubstituiBase.preco;
          }

          const adicionais =
            produto.atributos?.filter((attr) => attr.preco_incluido === 0) ||
            [];
          const totalAdicionais = adicionais.reduce(
            (soma, attr) => soma + Number(attr.preco),
            0,
          );

          return (
            (Number(precoBase) + Number(totalAdicionais)) * produto.quantidade
          );
        };

        const valorTotal = calcularPrecoProduto();

        return (
          <div
            key={produto.id}
            className={`${index >= 1 && "border-b border-zinc-400"} p-1`}
          >
            <h2 className="font-medium mb-2">
              {produto.quantidade}x - {produto.produto_nome}
            </h2>

            {produto.atributos?.length > 0 && (
              <div className="ml-4 mb-2 text-sm text-zinc-700">
                {produto.atributos.map((attr) => (
                  <p key={attr.id}>
                    • <strong>{attr.nome_atributo}:</strong> {attr.valor}{" "}
                    {Number(attr.preco) > 0 &&
                      `(${formatCurrencyBRL(Number(attr.preco))})`}
                  </p>
                ))}
              </div>
            )}

            {produto.observacao && (
              <p>
                <strong>Obs.:</strong> {produto.observacao}
              </p>
            )}

            <p className="font-bold mt-1">
              Subtotal: {formatCurrencyBRL(valorTotal)}
            </p>
          </div>
        );
      })}
      <p>
        <strong>Forma de pagamento:</strong> {pedido?.forma_pagamento}
      </p>
      <hr className="my-2" />
      <p className="text-right font-semibold">
        Entrega: {formatCurrencyBRL(Number(pedido?.taxa_entrega))}
      </p>
      <p className="text-right font-semibold">
        Total: {formatCurrencyBRL(Number(pedido?.valor_total))}
      </p>
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
