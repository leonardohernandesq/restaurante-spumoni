import { FiCalendar, FiClock, FiMapPin, FiPrinter, FiShoppingBag } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import type { Pedido } from "@/types/pedido";
import { StatusColor } from "@/components/StatusColor";
import { formatDateTimeBR, tempoDesde } from "@/domain/datetime";
import { getTipoEntregaLabel, hasStatus } from "@/domain/pedidoStatus";
import { buildWhatsappUrl } from "@/utils/format";

interface PedidoCabecalhoProps {
  pedidoId: number;
  pedido: Pedido | null;
  agora?: Date;
}

const Etiqueta = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${className}`}>
    {children}
  </span>
);

/** Número, status, quando foi feito, tipo de entrega e atalhos (WhatsApp, imprimir). */
export const PedidoCabecalho = ({ pedidoId, pedido, agora }: PedidoCabecalhoProps) => {
  const ha = pedido ? tempoDesde(pedido.data_pedido, agora) : null;
  const entrega = pedido?.tipo_entrega === "delivery";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className={`text-3xl font-bold tabular-nums text-zinc-900 ${pedido?.excluido ? "line-through decoration-2" : ""}`}
            >
              Pedido #{pedidoId}
            </h1>
            {pedido && hasStatus(pedido.status) && <StatusColor status={pedido.status} />}
            {pedido?.excluido && (
              <span className="rounded-md border border-zinc-400 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Excluído
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {pedido ? (
              <>
                Feito {ha ? <strong className="font-semibold text-zinc-700">{ha}</strong> : "em"}
                {ha ? " · " : " "}
                {formatDateTimeBR(pedido.data_pedido)}
              </>
            ) : (
              "Carregando pedido..."
            )}
          </p>

          {pedido && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Etiqueta
                className={entrega ? "bg-green-principal-500/10 text-green-principal-700" : "bg-zinc-100 text-zinc-700"}
              >
                {entrega ? <FiMapPin aria-hidden /> : <FiShoppingBag aria-hidden />}
                {getTipoEntregaLabel(pedido.tipo_entrega)}
              </Etiqueta>
              {pedido.entrega === "booking" && pedido.data_entrega ? (
                <Etiqueta className="bg-purple-principal-500/10 text-purple-principal-700">
                  <FiCalendar aria-hidden /> Agendado para {formatDateTimeBR(pedido.data_entrega)}
                </Etiqueta>
              ) : (
                <Etiqueta className="bg-zinc-100 text-zinc-700">
                  <FiClock aria-hidden /> Para agora
                </Etiqueta>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-2 print:hidden">
          {pedido?.telefone && (
            <a
              href={buildWhatsappUrl(pedido.telefone, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-green-500 hover:text-green-700"
            >
              <FaWhatsapp aria-hidden className="text-lg" /> WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!pedido}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            <FiPrinter aria-hidden className="text-lg" /> Imprimir
          </button>
        </div>
      </div>
    </section>
  );
};
