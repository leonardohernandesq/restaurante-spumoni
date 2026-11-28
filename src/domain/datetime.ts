/**
 * Datas e horas sempre no fuso da loja (São Paulo), independente do fuso do
 * aparelho do cliente ou do servidor.
 *
 * A API guarda `data_pedido` e `data_entrega` como "hora de parede" de São
 * Paulo, sem fuso ("2026-11-25 15:07:08" / "2026-11-26T10:00"). Por isso
 * formatamos essas strings direto, sem passar por `new Date()` (que
 * interpretaria no fuso do navegador e, no Safari, nem aceita o espaço).
 */

export const TIMEZONE_LOJA = "America/Sao_Paulo";

/** "YYYY-MM-DD HH:MM:SS" no horário de São Paulo. */
export const toSaoPauloSql = (date: Date = new Date()): string =>
  date.toLocaleString("sv-SE", { timeZone: TIMEZONE_LOJA }).replace("T", " ");

/** "YYYY-MM-DD" no horário de São Paulo. */
export const todaySaoPaulo = (date: Date = new Date()): string =>
  toSaoPauloSql(date).slice(0, 10);

/** "HH:MM" no horário de São Paulo. */
export const timeSaoPaulo = (date: Date = new Date()): string =>
  toSaoPauloSql(date).slice(11, 16);

export const isSameDaySaoPaulo = (a: Date, b: Date): boolean =>
  todaySaoPaulo(a) === todaySaoPaulo(b);

const WALL_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/;

export interface WallTime {
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM ("" se não tiver)
}

/** Lê "YYYY-MM-DD[ T]HH:MM[:SS]" sem converter fuso. */
export const parseWallTime = (valor?: string | null): WallTime | null => {
  const m = valor ? WALL_TIME.exec(valor) : null;
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  return { data: `${y}-${mo}-${d}`, hora: h ? `${h}:${mi}` : "" };
};

/** Dia da semana ISO (1 = segunda … 7 = domingo) de uma data "YYYY-MM-DD". */
export const diaSemanaIso = (data: string): number => {
  const [y, m, d] = data.split("-").map(Number);
  const dia = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = domingo
  return dia === 0 ? 7 : dia;
};

/**
 * "25/11/2026, 15:07" — formato usado no admin, impressão e resumo.
 * Strings da API são tratadas como hora de São Paulo; `Date` é convertido.
 */
export const formatDateTimeBR = (valor?: string | Date | null): string => {
  if (!valor) return "";

  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) return "";
    return formatDateTimeBR(toSaoPauloSql(valor));
  }

  const wall = parseWallTime(valor);
  if (!wall) return "";

  const [y, m, d] = wall.data.split("-");
  return wall.hora ? `${d}/${m}/${y}, ${wall.hora}` : `${d}/${m}/${y}`;
};

/** Minutos de parede (São Paulo) desde o início de 1970, para comparar horários. */
const minutosDeParede = (valor: string): number | null => {
  const w = parseWallTime(valor);
  if (!w || !w.hora) return null;
  const [y, m, d] = w.data.split("-").map(Number);
  const [h, mi] = w.hora.split(":").map(Number);
  return Date.UTC(y, m - 1, d, h, mi) / 60000;
};

/**
 * "agora", "há 5 min", "há 2 h" para pedidos de até 12 horas atrás; null se
 * for mais antigo (aí a data completa já basta). Tudo no horário de São Paulo.
 */
export const tempoDesde = (valor: string | undefined, agora: Date = new Date()): string | null => {
  if (!valor) return null;
  const inicio = minutosDeParede(valor);
  const fim = minutosDeParede(toSaoPauloSql(agora));
  if (inicio === null || fim === null) return null;
  const minutos = fim - inicio;
  if (minutos < 0 || minutos > 12 * 60) return null;
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  return `há ${Math.floor(minutos / 60)} h`;
};
