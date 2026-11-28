"use client";

/**
 * Gráficos das estatísticas (Recharts), num estilo só:
 * - uma série por gráfico, em azul; a categoria vai no eixo e o valor escrito
 *   na barra, então nada depende só da cor;
 * - nunca dois eixos Y: faturamento e nº de pedidos ficam em gráficos separados;
 * - grade e eixos discretos, tooltip no hover e tabela com os números.
 */
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Ajuda } from "@/components/ui/Ajuda";

export const CORES = {
  serie: "#257de0",
  serieHover: "#1b64be",
  grade: "#e8e8e8",
  eixo: "#666666",
  texto: "#191919",
  superficie: "#ffffff",
} as const;

export type Formato = (valor: number) => string;

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlCurto = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export const fmt = {
  moeda: (v: number) => brl.format(v),
  moedaCurta: (v: number) => (Math.abs(v) >= 1000 ? brlCurto.format(v) : brl.format(v)),
  inteiro: (v: number) => inteiro.format(v),
  decimal: (v: number) => decimal.format(v),
  percentual: (v: number) => `${decimal.format(v * 100)}%`,
};

/* ---------- Moldura: título, gráfico e tabela ---------- */

interface Coluna<T> {
  titulo: string;
  valor: (linha: T) => ReactNode;
  numerico?: boolean;
}

interface CartaoGraficoProps<T> {
  titulo: string;
  descricao?: string;
  /** Explicação de como o gráfico é calculado (ícone "i" ao lado do título). */
  ajuda?: ReactNode;
  children: ReactNode;
  /** Mesmos dados em tabela (acessibilidade e conferência). */
  tabela?: { linhas: T[]; colunas: Coluna<T>[]; chave: (linha: T) => string | number };
}

export function CartaoGrafico<T>({ titulo, descricao, ajuda, children, tabela }: CartaoGraficoProps<T>) {
  return (
    <figure className="bg-white rounded-xl border border-zinc-200 p-4 min-w-0">
      <figcaption className="mb-3">
        <h3 className="flex items-center gap-1 font-semibold text-zinc-900">
          {titulo}
          {ajuda && <Ajuda rotulo={`Como é calculado: ${titulo}`}>{ajuda}</Ajuda>}
        </h3>
        {descricao && <p className="text-sm text-zinc-600">{descricao}</p>}
      </figcaption>
      {children}
      {tabela && <TabelaDados {...tabela} />}
    </figure>
  );
}

export function TabelaDados<T>({
  linhas,
  colunas,
  chave,
  aberta = false,
}: NonNullable<CartaoGraficoProps<T>["tabela"]> & { aberta?: boolean }) {
  return (
    <details className="mt-3 text-sm" open={aberta}>
      <summary className="cursor-pointer text-purple-principal-700 select-none">
        Ver dados em tabela
      </summary>
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-600">
              {colunas.map((c) => (
                <th key={c.titulo} className={`py-1.5 pr-3 font-medium ${c.numerico ? "text-right" : ""}`}>
                  {c.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={chave(linha)} className="border-b border-zinc-100 last:border-0">
                {colunas.map((c) => (
                  <td
                    key={c.titulo}
                    className={`py-1.5 pr-3 text-zinc-900 ${c.numerico ? "text-right tabular-nums" : ""}`}
                  >
                    {c.valor(linha)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/* ---------- Tooltip ---------- */

interface LinhaTooltip {
  rotulo: string;
  formato: Formato;
}

const conteudoTooltip =
  (linhas: Record<string, LinhaTooltip>) =>
  // eslint-disable-next-line react/display-name
  ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: readonly { payload?: unknown }[];
    label?: unknown;
  }) => {
    if (!active || !payload?.length) return null;
    const dados = payload[0].payload as Record<string, number>;
    // Ponto com nome completo (ex.: "27/11 (sexta)") usa ele no título
    const detalhe = (payload[0].payload as { detalhe?: unknown }).detalhe;
    return (
      <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md text-sm">
        <p className="font-semibold text-zinc-900 mb-1">
          {typeof detalhe === "string" ? detalhe : String(label ?? "")}
        </p>
        {Object.entries(linhas).map(([campo, { rotulo, formato }]) => (
          <p key={campo} className="text-zinc-700 tabular-nums">
            {rotulo}: <span className="font-medium text-zinc-900">{formato(dados[campo] ?? 0)}</span>
          </p>
        ))}
      </div>
    );
  };

const eixo = { tick: { fill: CORES.eixo, fontSize: 12 }, axisLine: false, tickLine: false } as const;

/* ---------- Barras ---------- */

interface GraficoBarrasProps<T> {
  dados: T[];
  /** Campo com o nome da categoria. */
  categoria: keyof T & string;
  /** Campo numérico desenhado. */
  valor: keyof T & string;
  formato: Formato;
  rotuloValor: string;
  /** Linhas extras no tooltip (ex.: pedidos além do faturamento). */
  extras?: Record<string, LinhaTooltip>;
  /** Barras deitadas: bom para nomes longos (pratos, bairros). */
  horizontal?: boolean;
  /** Escreve o valor na ponta da barra. */
  mostrarValores?: boolean;
  altura?: number;
}

export function GraficoBarras<T extends object>({
  dados,
  categoria,
  valor,
  formato,
  rotuloValor,
  extras,
  horizontal = false,
  mostrarValores = true,
  altura,
}: GraficoBarrasProps<T>) {
  const linhasTooltip = { [valor]: { rotulo: rotuloValor, formato }, ...extras };
  const h = altura ?? (horizontal ? Math.max(160, dados.length * 34 + 30) : 260);
  const formatoCurto: Formato = (v) => (formato === fmt.moeda ? fmt.moedaCurta(v) : formato(v));

  return (
    <div style={{ height: h }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dados}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 18, right: horizontal ? 64 : 8, bottom: 0, left: 0 }}
          barCategoryGap={horizontal ? 6 : "18%"}
        >
          <CartesianGrid
            stroke={CORES.grade}
            horizontal={!horizontal}
            vertical={horizontal}
          />
          {horizontal ? (
            <>
              <XAxis type="number" {...eixo} tickFormatter={formatoCurto} />
              <YAxis type="category" dataKey={categoria as string} {...eixo} width={150} interval={0} />
            </>
          ) : (
            <>
              <XAxis dataKey={categoria as string} {...eixo} interval="preserveStartEnd" minTickGap={8} />
              <YAxis {...eixo} tickFormatter={formatoCurto} width={64} />
            </>
          )}
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            content={conteudoTooltip(linhasTooltip)}
          />
          <Bar
            dataKey={valor as string}
            fill={CORES.serie}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            activeBar={{ fill: CORES.serieHover }}
            maxBarSize={horizontal ? 24 : 48}
            isAnimationActive={false}
          >
            {mostrarValores && (
              <LabelList
                dataKey={valor as string}
                position={horizontal ? "right" : "top"}
                formatter={(v: unknown) => formatoCurto(Number(v))}
                style={{ fill: CORES.texto, fontSize: 12 }}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- Linha (evolução no tempo) ---------- */

interface GraficoLinhaProps<T> {
  dados: T[];
  categoria: keyof T & string;
  valor: keyof T & string;
  formato: Formato;
  rotuloValor: string;
  extras?: Record<string, LinhaTooltip>;
  altura?: number;
}

export function GraficoLinha<T extends object>({
  dados,
  categoria,
  valor,
  formato,
  rotuloValor,
  extras,
  altura = 280,
}: GraficoLinhaProps<T>) {
  const formatoCurto: Formato = (v) => (formato === fmt.moeda ? fmt.moedaCurta(v) : formato(v));
  const poucosPontos = dados.length <= 31;

  return (
    <div style={{ height: altura }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={CORES.grade} vertical={false} />
          <XAxis
            dataKey={categoria as string}
            {...eixo}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis {...eixo} tickFormatter={formatoCurto} width={64} />
          <Tooltip
            cursor={{ stroke: CORES.eixo, strokeDasharray: "3 3" }}
            content={conteudoTooltip({ [valor]: { rotulo: rotuloValor, formato }, ...extras })}
          />
          <Line
            type="monotone"
            dataKey={valor as string}
            stroke={CORES.serie}
            strokeWidth={2}
            dot={poucosPontos ? { r: 3, fill: CORES.serie, strokeWidth: 0 } : false}
            activeDot={{ r: 5, fill: CORES.serie, stroke: CORES.superficie, strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
