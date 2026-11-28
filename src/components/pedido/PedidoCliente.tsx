import type { ReactNode } from "react";
import { FiCreditCard, FiMapPin, FiShoppingBag, FiUser } from "react-icons/fi";
import type { Pedido } from "@/types/pedido";
import { getFormaPagamentoLabel } from "@/domain/pedidoStatus";
import { exibirTelefone, formatCurrencyBRL } from "@/utils/format";

const Linha = ({ rotulo, children }: { rotulo: string; children: ReactNode }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">{rotulo}</dt>
    <dd className="text-zinc-800">{children}</dd>
  </div>
);

const Secao = ({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) => (
  <div className="p-5">
    <h2 className="mb-3 flex items-center gap-2 font-semibold text-zinc-900">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-principal-500/10 text-purple-principal-700">
        {icone}
      </span>
      {titulo}
    </h2>
    {children}
  </div>
);

/** Um cartão só, dividido em cliente, entrega e pagamento. */
export const PedidoCliente = ({ pedido, total }: { pedido: Pedido; total: number }) => {
  const entrega = pedido.tipo_entrega === "delivery";
  const troco = pedido.troco && pedido.troco > 0 ? pedido.troco : 0;

  return (
    <section className="grid divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white shadow-sm md:grid-cols-[1fr_2fr_1fr] md:divide-x md:divide-y-0">
      <Secao icone={<FiUser />} titulo="Cliente">
        <dl className="flex flex-col gap-3">
          <Linha rotulo="Nome">
            <span className="font-semibold">{pedido.nome_cliente || "—"}</span>
          </Linha>
          {pedido.telefone && (
            <Linha rotulo="Telefone">
              <a href={`tel:${pedido.telefone}`} className="hover:underline">
                {exibirTelefone(pedido.telefone)}
              </a>
            </Linha>
          )}
          {pedido.nota_fiscal && <Linha rotulo="Nota fiscal (CPF/CNPJ)">{pedido.nota_fiscal}</Linha>}
        </dl>
      </Secao>

      <Secao icone={entrega ? <FiMapPin /> : <FiShoppingBag />} titulo={entrega ? "Entrega" : "Retirada"}>
        {entrega ? (
          <dl className="flex flex-col gap-3">
            <Linha rotulo="Endereço">
              <span className="block font-semibold">
                {[pedido.endereco_entrega, pedido.numero].filter(Boolean).join(", ") || "—"}
                {pedido.complemento && <span className="font-normal text-zinc-600"> · {pedido.complemento}</span>}
              </span>
              <span className="block text-zinc-600">
                {[pedido.bairro, pedido.cep && `CEP ${pedido.cep}`].filter(Boolean).join(" · ")}
              </span>
            </Linha>
            {pedido.referencia && <Linha rotulo="Referência">{pedido.referencia}</Linha>}
          </dl>
        ) : (
          <p className="text-zinc-700">O cliente vai buscar na loja.</p>
        )}
      </Secao>

      <Secao icone={<FiCreditCard />} titulo="Pagamento">
        <dl className="flex flex-col gap-3">
          <Linha rotulo="Forma">
            <span className="font-semibold">{getFormaPagamentoLabel(pedido.forma_pagamento)}</span>
          </Linha>
          {troco > 0 && (
            <Linha rotulo="Troco">
              Para {formatCurrencyBRL(troco)}
              {troco > total && (
                <span className="mt-1 block rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-800">
                  Levar {formatCurrencyBRL(troco - total)} de troco
                </span>
              )}
            </Linha>
          )}
        </dl>
      </Secao>
    </section>
  );
};
