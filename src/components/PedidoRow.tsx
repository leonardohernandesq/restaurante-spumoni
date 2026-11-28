"use client";

import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import { FiCalendar, FiClock, FiCreditCard, FiMapPin, FiPhone, FiShoppingBag } from "react-icons/fi";

import type { Pedido } from "@/types/pedido";

import { StatusColor } from "@/components/StatusColor";
import { DetailPedidos } from "@/components/DetailPedidos";
import { formatDateTimeBR, tempoDesde } from "@/domain/datetime";
import { getFormaPagamentoLabel } from "@/domain/pedidoStatus";
import { exibirTelefone } from "@/utils/format";

interface PedidoRowProps {
  pedido: Pedido;
  /** Relógio da tela (atualiza o "há X min" sem refazer a lista). */
  agora?: Date;
}

const Info = ({ icone, children }: { icone: React.ReactNode; children: React.ReactNode }) => (
  <span className="flex items-center gap-1.5 whitespace-nowrap">
    <span className="text-zinc-400" aria-hidden>
      {icone}
    </span>
    {children}
  </span>
);

export const PedidoRow = ({ pedido, agora }: PedidoRowProps) => {
  const router = useRouter();
  const href = `/admin/pedido/${pedido.id}`;

  useEffect(() => {
    if (pedido.id) router.prefetch(href);
  }, [pedido.id, href, router]);

  const novo = pedido.status === 1 && !pedido.excluido;
  const ha = tempoDesde(pedido.data_pedido, agora);
  const entrega = pedido.tipo_entrega === "delivery";

  return (
    <button
      type="button"
      onClick={() => pedido.id && router.push(href)}
      className={`group relative my-2 flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-xl border py-3 pl-5 pr-4 text-left transition ${
        pedido.excluido
          ? "border-dashed border-zinc-300 bg-white opacity-60 hover:opacity-90"
          : novo
            ? "border-yellow-200 bg-yellow-50/60 hover:border-yellow-300 hover:shadow-sm"
            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
      }`}
    >
      {/* Lateral com a cor do status */}
      <DetailPedidos status={pedido.status ?? 0} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <strong className={`text-lg tabular-nums text-zinc-900 ${pedido.excluido ? "line-through" : ""}`}>
            #{pedido.id}
          </strong>
          <span className="truncate font-medium text-zinc-800">{pedido.nome_cliente}</span>
          <span className="text-sm text-zinc-500">
            {ha && <span className={novo ? "font-semibold text-yellow-800" : ""}>{ha} · </span>}
            {formatDateTimeBR(pedido.data_pedido)}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
          {pedido.telefone && <Info icone={<FiPhone />}>{exibirTelefone(pedido.telefone)}</Info>}
          <Info icone={entrega ? <FiMapPin /> : <FiShoppingBag />}>
            {entrega ? `Entrega${pedido.bairro ? ` · ${pedido.bairro}` : ""}` : "Retirada na loja"}
          </Info>
          {pedido.forma_pagamento && (
            <Info icone={<FiCreditCard />}>{getFormaPagamentoLabel(pedido.forma_pagamento)}</Info>
          )}
          {pedido.entrega === "booking" && pedido.data_entrega && (
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-purple-principal-500/10 px-2 py-0.5 font-medium text-purple-principal-700">
              <FiCalendar aria-hidden /> Agendado: {formatDateTimeBR(pedido.data_entrega)}
            </span>
          )}
          {pedido.entrega === "now" && novo && (
            <Info icone={<FiClock />}>Para agora</Info>
          )}
        </div>
      </div>

      {/* Etiqueta do status */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <StatusColor status={pedido.status || 0} />
        {pedido.excluido && (
          <span className="rounded-md border border-zinc-400 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-600">
            Excluído
          </span>
        )}
      </div>
    </button>
  );
};
