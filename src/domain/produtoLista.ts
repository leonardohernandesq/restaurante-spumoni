/**
 * Regras da lista de produtos do admin.
 *
 * Dias do PRODUTO: 1 = domingo … 7 = sábado (diferente dos horários de
 * funcionamento, onde 1 = segunda). O cardápio só mostra o produto ativo
 * nos dias marcados.
 */
import { diaSemanaIso, todaySaoPaulo } from "./datetime";

export type StatusProduto = "hoje" | "fora" | "inativo";

/** Dia de hoje (São Paulo) na convenção do produto: 1 = domingo … 7 = sábado. */
export const diaDoProdutoHoje = (hoje: string = todaySaoPaulo()): number =>
  (diaSemanaIso(hoje) % 7) + 1;

interface ProdutoStatusInfo {
  active?: boolean;
  ativo?: boolean;
  available_days?: number[];
}

/**
 * - `hoje`: ativo e marcado para hoje → aparece no cardápio agora;
 * - `fora`: ativo, mas não é dia dele;
 * - `inativo`: escondido do cardápio.
 */
export const statusDoProduto = (produto: ProdutoStatusInfo, diaHoje: number): StatusProduto => {
  const ativo = produto.active ?? produto.ativo ?? false;
  if (!ativo) return "inativo";
  return (produto.available_days ?? []).map(Number).includes(diaHoje) ? "hoje" : "fora";
};

export const STATUS_PRODUTO: Record<StatusProduto, { rotulo: string; filtro: string; classe: string }> = {
  hoje: { rotulo: "No cardápio hoje", filtro: "No cardápio hoje", classe: "bg-green-100 text-green-800" },
  fora: { rotulo: "Não é dia dele", filtro: "Fora do dia", classe: "bg-amber-100 text-amber-800" },
  inativo: { rotulo: "Inativo", filtro: "Inativos", classe: "bg-zinc-200 text-zinc-700" },
};

/** Nome do dia na convenção do produto (índice 0 = domingo). */
const NOMES_DIA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** "hoje", "no domingo", "na segunda"… */
export const quandoDia = (dia: number, diaHoje: number): string => {
  if (dia === diaHoje) return "hoje";
  const nome = NOMES_DIA[dia - 1] ?? "";
  return `${dia === 1 || dia === 7 ? "no" : "na"} ${nome}`;
};

/**
 * Rótulo do status olhando um dia escolhido (não só hoje):
 * "No cardápio hoje", "No cardápio na quarta"…
 */
export const rotuloStatus = (status: StatusProduto, dia: number, diaHoje: number): string =>
  status === "hoje" ? `No cardápio ${quandoDia(dia, diaHoje)}` : STATUS_PRODUTO[status].rotulo;

/** Busca sem acento e sem diferença de maiúsculas (nome e descrição). */
export const produtoCombina = (
  produto: { name?: string; description?: string; descricao?: string },
  busca: string,
): boolean => {
  const termo = semAcento(busca);
  if (!termo) return true;
  return semAcento(`${produto.name ?? ""} ${produto.description ?? produto.descricao ?? ""}`).includes(termo);
};

const semAcento = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
