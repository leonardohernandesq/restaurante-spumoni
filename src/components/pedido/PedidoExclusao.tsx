"use client";

import { toast } from "react-toastify";
import { FiRotateCcw, FiTrash2 } from "react-icons/fi";
import type { Pedido } from "@/types/pedido";
import { useMarcarPedidoExcluido } from "@/queries/pedidos";
import { formatDateTimeBR } from "@/domain/datetime";

/**
 * Excluir / restaurar o pedido. Excluir não apaga nada: o pedido vai para o
 * fim da lista e deixa de contar nas estatísticas, mantendo o status.
 */
const useExclusao = (pedido: Pedido) => {
  const marcar = useMarcarPedidoExcluido();

  const alterar = (excluido: boolean) => {
    if (
      excluido &&
      !confirm(
        `Excluir o pedido ${pedido.id}?\n\nEle vai para o fim da lista de pedidos e deixa de contar nas estatísticas. Dá para restaurar depois.`,
      )
    )
      return;

    marcar.mutate(
      { id: pedido.id, excluido },
      {
        onSuccess: () => toast.success(excluido ? "Pedido excluído." : "Pedido restaurado."),
        onError: () =>
          toast.error(
            excluido ? "Não foi possível excluir o pedido." : "Não foi possível restaurar o pedido.",
          ),
      },
    );
  };

  return { alterar, pendente: marcar.isPending };
};

/** Botão "Excluir pedido", para ficar junto das outras ações. */
export const BotaoExcluirPedido = ({ pedido, className }: { pedido: Pedido; className: string }) => {
  const { alterar, pendente } = useExclusao(pedido);
  return (
    <button type="button" onClick={() => alterar(true)} disabled={pendente} className={className}>
      <FiTrash2 aria-hidden />
      {pendente ? "Excluindo..." : "Excluir pedido"}
    </button>
  );
};

/** Aviso no topo de um pedido excluído, com "Restaurar". */
export const PedidoExclusao = ({ pedido }: { pedido: Pedido }) => {
  const { alterar, pendente } = useExclusao(pedido);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-zinc-400 bg-white p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div>
        <p className="font-semibold text-zinc-800">Este pedido está excluído</p>
        <p className="text-sm text-zinc-600">
          {pedido.excluido_em ? `Excluído em ${formatDateTimeBR(pedido.excluido_em)}. ` : ""}
          Fica no fim da lista e não conta nas estatísticas.
        </p>
      </div>
      <button
        type="button"
        onClick={() => alterar(false)}
        disabled={pendente}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-50"
      >
        <FiRotateCcw aria-hidden />
        {pendente ? "Restaurando..." : "Restaurar pedido"}
      </button>
    </div>
  );
};
