"use client";

import { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import { Container } from "@/components/Container";
import { TituloAdmin } from "@/components/admin/TituloAdmin";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import { SenhaEstatisticas } from "@/components/estatisticas/SenhaEstatisticas";
import { AJUDA } from "@/components/estatisticas/ajudas";
import { Ajuda } from "@/components/ui/Ajuda";
import {
  AbaClientes,
  AbaDiasHorarios,
  AbaFaturamento,
  AbaPratos,
  AbaVisaoGeral,
} from "@/components/estatisticas/abas";
import {
  ErroEstatisticas,
  useBloquearAoSair,
  useEstatisticasQuery,
  useSessaoEstatisticas,
  type FiltroEstatisticas,
} from "@/queries/estatisticas";
import {
  PRESETS,
  formatarDataBR,
  periodoDoPreset,
  validarIntervalo,
  type PeriodoComparado,
  type TipoPeriodo,
} from "@/domain/periodo";
import { todaySaoPaulo } from "@/domain/datetime";

const ABAS = [
  { id: "geral", label: "Visão geral", Componente: AbaVisaoGeral },
  { id: "faturamento", label: "Faturamento", Componente: AbaFaturamento },
  { id: "pratos", label: "Pratos mais vendidos", Componente: AbaPratos },
  { id: "dias", label: "Dias e horários", Componente: AbaDiasHorarios },
  { id: "clientes", label: "Clientes e bairros", Componente: AbaClientes },
] as const;

type IdAba = (typeof ABAS)[number]["id"];

const NOME_ANTERIOR: Record<TipoPeriodo, string> = {
  hoje: "mesmo dia da semana passada",
  semana: "semana passada",
  mes: "mês passado",
  trimestre: "trimestre passado",
  ano: "ano passado",
  personalizado: "período anterior",
};

const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** "sexta passada" no Hoje; nos outros, o nome fixo do período anterior. */
const nomeAnterior = (p: PeriodoComparado): string => {
  if (p.tipo !== "hoje") return NOME_ANTERIOR[p.tipo];
  const dia = new Date(`${p.anterior.de}T12:00:00Z`).getUTCDay();
  return `${DIAS[dia]} passad${dia === 0 || dia === 6 ? "o" : "a"}`;
};

const botaoPeriodo = (ativo: boolean) =>
  `px-3 py-1.5 rounded-md text-sm cursor-pointer border ${
    ativo
      ? "bg-purple-principal-700 border-purple-principal-700 text-white font-medium"
      : "bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50"
  }`;

export default function Estatisticas() {
  const hoje = todaySaoPaulo();
  const mesAtual = periodoDoPreset("mes", hoje).atual;

  const [filtro, setFiltro] = useState<FiltroEstatisticas>({
    periodo: "mes",
    somenteFinalizados: false,
  });
  const [rascunho, setRascunho] = useState(mesAtual);
  const [erroIntervalo, setErroIntervalo] = useState("");
  const [aba, setAba] = useState<IdAba>("geral");

  const { data, error, isPending, isFetching, isPlaceholderData, refetch } =
    useEstatisticasQuery(filtro);
  const { bloquear } = useSessaoEstatisticas();
  useBloquearAoSair();

  const motivo = error instanceof ErroEstatisticas ? error.motivo : null;

  // Sessão do admin expirou: volta para o login
  useEffect(() => {
    if (motivo === "login") window.location.href = "/admin";
  }, [motivo]);

  const escolherPreset = (periodo: TipoPeriodo) => {
    setErroIntervalo("");
    setFiltro((f) => ({ ...f, periodo, de: undefined, ate: undefined }));
  };

  const aplicarIntervalo = () => {
    const erro = validarIntervalo(rascunho.de, rascunho.ate, hoje);
    setErroIntervalo(erro ?? "");
    if (!erro) setFiltro((f) => ({ ...f, periodo: "personalizado", ...rascunho }));
  };

  const precisaSenha = motivo === "senha" && !data;
  const Aba = ABAS.find((a) => a.id === aba)!.Componente;

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
      <div className="py-4">
        <TituloAdmin title="Estatísticas" />
      </div>

      {precisaSenha ? (
        <SenhaEstatisticas onLiberado={() => refetch()} />
      ) : motivo === "config" ? (
        <ErrorState mensagem="As estatísticas ainda não foram configuradas no servidor (STATS_PASSWORD e STATS_API_KEY)." />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Filtros: uma linha acima de tudo */}
          <section className="flex flex-col gap-3 bg-white rounded-xl border border-zinc-200 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.tipo}
                  type="button"
                  onClick={() => escolherPreset(p.tipo)}
                  aria-pressed={filtro.periodo === p.tipo}
                  className={botaoPeriodo(filtro.periodo === p.tipo)}
                >
                  {p.label}
                </button>
              ))}

              <span className="mx-1 h-6 w-px bg-zinc-200" aria-hidden />

              <label className="flex items-center gap-1 text-sm text-zinc-700">
                De
                <input
                  type="date"
                  value={rascunho.de}
                  max={hoje}
                  onChange={(ev) => setRascunho((r) => ({ ...r, de: ev.target.value }))}
                  className="p-1.5 border border-zinc-300 rounded-md"
                />
              </label>
              <label className="flex items-center gap-1 text-sm text-zinc-700">
                até
                <input
                  type="date"
                  value={rascunho.ate}
                  max={hoje}
                  onChange={(ev) => setRascunho((r) => ({ ...r, ate: ev.target.value }))}
                  className="p-1.5 border border-zinc-300 rounded-md"
                />
              </label>
              <button
                type="button"
                onClick={aplicarIntervalo}
                aria-pressed={filtro.periodo === "personalizado"}
                className={botaoPeriodo(filtro.periodo === "personalizado")}
              >
                Aplicar período
              </button>

              <button
                type="button"
                onClick={() => bloquear.mutate(undefined, { onSettled: () => refetch() })}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer"
              >
                <FiLock aria-hidden /> Bloquear
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              {/* O "i" fica fora do label: clicar nele não marca a opção */}
              <span className="flex items-center gap-1">
                <label className="flex items-center gap-2 text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtro.somenteFinalizados}
                    onChange={(ev) =>
                      setFiltro((f) => ({ ...f, somenteFinalizados: ev.target.checked }))
                    }
                  />
                  Contar só pedidos finalizados
                </label>
                <Ajuda rotulo="O que é contar só pedidos finalizados">
                  {AJUDA.somenteFinalizados}
                </Ajuda>
              </span>
              {data && (
                <p className="text-zinc-600">
                  {data.periodo.atual.de === data.periodo.atual.ate
                    ? formatarDataBR(data.periodo.atual.de)
                    : `${formatarDataBR(data.periodo.atual.de)} a ${formatarDataBR(data.periodo.atual.ate)}`}
                  <span className="text-zinc-500">
                    {" "}
                    · comparado com {formatarDataBR(data.periodo.anterior.de)}
                    {data.periodo.anterior.ate !== data.periodo.anterior.de &&
                      ` a ${formatarDataBR(data.periodo.anterior.ate)}`}
                  </span>
                </p>
              )}
            </div>
            {erroIntervalo && (
              <p role="alert" className="text-sm text-red-700">
                {erroIntervalo}
              </p>
            )}
          </section>

          {/* Abas */}
          <div role="tablist" aria-label="Estatísticas" className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-zinc-300">
            {ABAS.map((a) => (
              <button
                key={a.id}
                role="tab"
                type="button"
                id={`aba-${a.id}`}
                aria-selected={aba === a.id}
                aria-controls="painel-estatisticas"
                onClick={() => setAba(a.id)}
                className={`px-4 py-2 text-sm whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                  aba === a.id
                    ? "border-purple-principal-700 text-purple-principal-700 font-semibold"
                    : "border-transparent text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <section
            id="painel-estatisticas"
            role="tabpanel"
            aria-labelledby={`aba-${aba}`}
            aria-busy={isFetching}
            className={isPlaceholderData ? "opacity-60 transition-opacity" : undefined}
          >
            {isPending ? (
              <LoadingState mensagem="Calculando estatísticas..." />
            ) : error && !data ? (
              <ErrorState
                mensagem={error.message}
                onRetry={motivo === "api" ? () => refetch() : undefined}
                tentando={isFetching}
              />
            ) : data ? (
              <Aba e={data.estatisticas} nomeAnterior={nomeAnterior(data.periodo)} />
            ) : null}
          </section>

          <p className="text-xs text-zinc-500">
            Pedidos feitos a partir de 26/11/2026 usam o preço da hora da venda. Os anteriores
            usam o preço atual dos produtos (o valor da época não foi guardado). Pedidos
            cancelados não entram no faturamento.
          </p>
        </div>
      )}
    </Container>
  );
}
