import type { ReactNode } from "react";
import { FiArrowDownRight, FiArrowUpRight, FiMinus } from "react-icons/fi";
import { Ajuda } from "@/components/ui/Ajuda";
import { fmt } from "./graficos";

interface IndicadorProps {
  titulo: string;
  valor: string;
  /** Texto pequeno abaixo do valor (ex.: "de 120 pedidos"). */
  detalhe?: string;
  /** Variação vs. período anterior (0.1 = +10%). `null`/ausente = sem comparação. */
  variacao?: number | null;
  /** Para custos/cancelamentos, subir é ruim. */
  subirEhRuim?: boolean;
  anterior?: string;
  /** Explicação de como o número é calculado (ícone "i" ao lado do título). */
  ajuda?: ReactNode;
}

/** Número de destaque com a comparação ao período anterior (ícone + texto, não só cor). */
export const Indicador = ({
  titulo,
  valor,
  detalhe,
  variacao,
  subirEhRuim = false,
  anterior,
  ajuda,
}: IndicadorProps) => {
  const temVariacao = variacao !== undefined && variacao !== null && Number.isFinite(variacao);
  const estavel = temVariacao && Math.abs(variacao) < 0.005;
  const subiu = temVariacao && variacao > 0;
  const bom = estavel ? null : subiu !== subirEhRuim;

  const Icone = estavel ? FiMinus : subiu ? FiArrowUpRight : FiArrowDownRight;
  const cor = bom === null ? "text-zinc-600" : bom ? "text-green-700" : "text-red-700";

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-1 min-w-0">
      <p className="flex items-center gap-1 text-sm text-zinc-600">
        {titulo}
        {ajuda && <Ajuda rotulo={`Como é calculado: ${titulo}`}>{ajuda}</Ajuda>}
      </p>
      <p className="text-2xl font-semibold text-zinc-900 tabular-nums truncate" title={valor}>
        {valor}
      </p>
      {detalhe && <p className="text-xs text-zinc-500">{detalhe}</p>}
      {temVariacao ? (
        <p className={`text-xs flex items-center gap-1 ${cor}`}>
          <Icone aria-hidden className="shrink-0" />
          <span>
            {estavel ? "Estável" : `${subiu ? "+" : ""}${fmt.percentual(variacao)}`}
            {anterior && <span className="text-zinc-500"> vs. {anterior}</span>}
          </span>
        </p>
      ) : (
        anterior !== undefined && (
          <p className="text-xs text-zinc-500">Sem dados no período anterior</p>
        )
      )}
    </div>
  );
};
