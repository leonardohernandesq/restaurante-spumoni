/**
 * Períodos das estatísticas, sempre em datas "YYYY-MM-DD" do calendário de
 * São Paulo (a conta é feita em UTC só para não depender do fuso da máquina).
 */

export type PresetPeriodo = "hoje" | "semana" | "mes" | "trimestre" | "ano";
export type TipoPeriodo = PresetPeriodo | "personalizado";

export interface Intervalo {
  de: string;
  ate: string;
}

export interface PeriodoComparado {
  tipo: TipoPeriodo;
  atual: Intervalo;
  /** Mesmo trecho do período anterior (semana/mês/trimestre/ano passado). */
  anterior: Intervalo;
}

/** Período personalizado mais longo aceito (o anterior dobra a busca). */
export const MAX_DIAS_PERSONALIZADO = 366;

export const PRESETS: { tipo: PresetPeriodo; label: string }[] = [
  { tipo: "hoje", label: "Hoje" },
  { tipo: "semana", label: "Semana" },
  { tipo: "mes", label: "Mês" },
  { tipo: "trimestre", label: "Trimestre" },
  { tipo: "ano", label: "Ano" },
];

const DATA = /^(\d{4})-(\d{2})-(\d{2})$/;

const paraUtc = (data: string): Date => {
  const m = DATA.exec(data);
  if (!m) throw new Error(`Data inválida: ${data}`);
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
};

const deUtc = (d: Date): string => d.toISOString().slice(0, 10);

export const isDataValida = (data: unknown): data is string => {
  if (typeof data !== "string" || !DATA.test(data)) return false;
  return deUtc(paraUtc(data)) === data;
};

export const somarDias = (data: string, dias: number): string => {
  const d = paraUtc(data);
  d.setUTCDate(d.getUTCDate() + dias);
  return deUtc(d);
};

/** Dias entre duas datas, contando as duas pontas ("2026-11-01".."2026-11-01" = 1). */
export const diasNoIntervalo = ({ de, ate }: Intervalo): number =>
  Math.round((paraUtc(ate).getTime() - paraUtc(de).getTime()) / 864e5) + 1;

/** Soma meses mantendo o dia, limitado ao último dia do mês (31/03 - 1 mês = 28/02). */
const somarMeses = (data: string, meses: number): string => {
  const d = paraUtc(data);
  const dia = d.getUTCDate();
  const alvo = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + meses, 1));
  const ultimoDia = new Date(
    Date.UTC(alvo.getUTCFullYear(), alvo.getUTCMonth() + 1, 0),
  ).getUTCDate();
  alvo.setUTCDate(Math.min(dia, ultimoDia));
  return deUtc(alvo);
};

/** Segunda-feira da semana da data. */
export const inicioDaSemana = (data: string): string => {
  const dia = paraUtc(data).getUTCDay(); // 0 = domingo
  return somarDias(data, -(dia === 0 ? 6 : dia - 1));
};

/**
 * Período "até hoje" do preset e o mesmo trecho do período anterior.
 * Ex.: mês em 26/11 → 01/11..26/11 comparado com 01/10..26/10.
 */
export const periodoDoPreset = (
  tipo: PresetPeriodo,
  hoje: string,
): PeriodoComparado => {
  const [ano, mes] = hoje.split("-").map(Number);

  // Restaurante varia muito por dia da semana: compara com o mesmo dia da semana passada
  if (tipo === "hoje") {
    const passado = somarDias(hoje, -7);
    return { tipo, atual: { de: hoje, ate: hoje }, anterior: { de: passado, ate: passado } };
  }

  if (tipo === "semana") {
    const de = inicioDaSemana(hoje);
    return {
      tipo,
      atual: { de, ate: hoje },
      anterior: { de: somarDias(de, -7), ate: somarDias(hoje, -7) },
    };
  }

  const meses = tipo === "mes" ? 1 : tipo === "trimestre" ? 3 : 12;
  const mesInicial =
    tipo === "mes" ? mes : tipo === "trimestre" ? Math.floor((mes - 1) / 3) * 3 + 1 : 1;
  const de = `${ano}-${String(mesInicial).padStart(2, "0")}-01`;

  return {
    tipo,
    atual: { de, ate: hoje },
    anterior: { de: somarMeses(de, -meses), ate: somarMeses(hoje, -meses) },
  };
};

/** Período escolhido à mão: compara com o mesmo número de dias logo antes. */
export const periodoPersonalizado = (atual: Intervalo): PeriodoComparado => {
  const dias = diasNoIntervalo(atual);
  return {
    tipo: "personalizado",
    atual,
    anterior: { de: somarDias(atual.de, -dias), ate: somarDias(atual.de, -1) },
  };
};

/** Valida um período personalizado vindo da URL. Devolve a mensagem de erro, se houver. */
export const validarIntervalo = (
  de: unknown,
  ate: unknown,
  hoje: string,
): string | null => {
  if (!isDataValida(de) || !isDataValida(ate)) return "Datas inválidas.";
  if (de > ate) return "A data inicial deve ser antes da final.";
  if (ate > hoje) return "A data final não pode estar no futuro.";
  if (diasNoIntervalo({ de, ate }) > MAX_DIAS_PERSONALIZADO) {
    return `Escolha no máximo ${MAX_DIAS_PERSONALIZADO} dias.`;
  }
  return null;
};

/** "26/11/2026" */
export const formatarDataBR = (data: string): string => {
  const [a, m, d] = data.split("-");
  return `${d}/${m}/${a}`;
};
