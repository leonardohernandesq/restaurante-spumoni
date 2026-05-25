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
        {pedido?.id && (
          <>
            <strong>Pedido:</strong> {pedido.id} -{" "}
          </>
        )}
        {pedido?.data_pedido &&
          new Date(pedido.data_pedido).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}

        {pedido?.data_entrega && (
          <>
            {" "}
            <strong>Entrega agendada:</strong>{" "}
            {new Date(pedido.data_entrega).toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
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
      {pedido &&
        (() => {
          const calcularPrecoProduto = (
            produto: (typeof pedido.produtos)[0],
          ) => {
            let precoFinal = Number(produto.preco_base);
            produto.atributos?.forEach((attr) => {
              if (Number(attr.preco_incluido) === 1) {
                precoFinal = Number(attr.preco);
              } else {
                precoFinal += Number(attr.preco);
              }
            });
            return precoFinal * produto.quantidade;
          };

          const totalProdutos = pedido.produtos.reduce(
            (acc, p) => acc + calcularPrecoProduto(p),
            0,
          );
          const totalGeral = totalProdutos + Number(pedido.taxa_entrega);

          return (
            <>
              {pedido.produtos.map((produto, index) => {
                const valorTotal = calcularPrecoProduto(produto);
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
                            • <strong>{attr.nome_atributo}:</strong>{" "}
                            {attr.valor}{" "}
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
                <strong>Forma de pagamento:</strong> {pedido.forma_pagamento}
              </p>
              <hr className="my-2" />
              <p className="text-right font-semibold">
                Entrega: {formatCurrencyBRL(Number(pedido.taxa_entrega))}
              </p>
              <p className="text-right font-semibold">
                Total: {formatCurrencyBRL(totalGeral)}
              </p>
            </>
          );
        })()}
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
