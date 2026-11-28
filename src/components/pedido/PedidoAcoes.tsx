import { FiCheck, FiXCircle } from "react-icons/fi";
import type { Pedido } from "@/types/pedido";
import { PedidoStatus } from "@/domain/pedidoStatus";
import { BotaoExcluirPedido } from "@/components/pedido/PedidoExclusao";

interface PedidoAcoesProps {
  pedido: Pedido;
  onChangeStatus: (status: PedidoStatus) => void;
  desabilitado?: boolean;
}

const BOTAO_SECUNDARIO =
  "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-wait disabled:opacity-60";

/** Concluir em destaque; cancelar e excluir juntos, mais discretos, embaixo. */
export const PedidoAcoes = ({ pedido, onChangeStatus, desabilitado }: PedidoAcoesProps) => {
  const cancelado = pedido.status === 0;
  const finalizado = pedido.status === 4;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm print:hidden">
      <button
        type="button"
        onClick={() => onChangeStatus(4)}
        disabled={desabilitado}
        aria-pressed={finalizado}
        className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl p-4 text-left transition disabled:cursor-wait disabled:opacity-60 ${
          finalizado
            ? "border border-green-200 bg-green-50 text-green-900 hover:bg-green-100"
            : "bg-green-600 text-white shadow-sm hover:bg-green-700 hover:shadow-md"
        }`}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl transition group-hover:scale-105 ${
            finalizado ? "bg-green-600 text-white" : "bg-white/20 text-white"
          }`}
        >
          <FiCheck aria-hidden />
        </span>
        <span className="flex flex-col">
          <span className="text-lg font-semibold leading-tight">
            {finalizado ? "Pedido finalizado" : "Concluir pedido"}
          </span>
          <span className={`text-sm ${finalizado ? "text-green-700" : "text-white/80"}`}>
            {finalizado
              ? "Clique para enviar a mensagem de novo"
              : "Avisa o cliente pelo WhatsApp"}
          </span>
        </span>
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-zinc-100 pt-4">
        <button
          type="button"
          onClick={() => onChangeStatus(0)}
          disabled={desabilitado}
          aria-pressed={cancelado}
          className={`${BOTAO_SECUNDARIO} ${
            cancelado ? "bg-red-700 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          <FiXCircle aria-hidden />
          {cancelado ? "Pedido cancelado" : "Cancelar pedido"}
        </button>

        {/* Excluído: o "Restaurar" fica no aviso do topo */}
        {!pedido.excluido && (
          <BotaoExcluirPedido
            pedido={pedido}
            className={`${BOTAO_SECUNDARIO} bg-zinc-100 text-zinc-700 hover:bg-zinc-200`}
          />
        )}
      </div>
    </section>
  );
};
