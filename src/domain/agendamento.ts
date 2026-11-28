import {
  diaSemanaIso,
  parseWallTime,
  timeSaoPaulo,
  todaySaoPaulo,
} from "./datetime";

export interface HorarioFuncionamento {
  dia_semana: string | number;
  horario_abertura: string; // "09:30:00"
  horario_fechamento: string; // "15:30:00"
}

/** Usado só enquanto os horários da loja não carregaram. */
const HORARIO_PADRAO = { abertura: "09:00", fechamento: "18:00" };

const hh = (hora: string) => Number(hora.slice(0, 2));

/**
 * Valida a data/hora de uma entrega agendada (valor do input datetime-local).
 * Devolve a mensagem de erro, ou `null` se estiver ok.
 */
export const validarAgendamento = (
  valor: string,
  agora: Date,
  horarios: HorarioFuncionamento[] = [],
): string | null => {
  const escolhido = parseWallTime(valor);
  if (!escolhido || !escolhido.hora) return "Informe uma data e hora válidas";

  const hoje = todaySaoPaulo(agora);
  const horaAgora = timeSaoPaulo(agora);

  if (`${escolhido.data} ${escolhido.hora}` < `${hoje} ${horaAgora}`) {
    return "A data não pode ser no passado";
  }

  if (horarios.length > 0) {
    const dia = diaSemanaIso(escolhido.data);
    const horario = horarios.find((h) => Number(h.dia_semana) === dia);

    if (!horario) {
      return "Não abrimos neste dia. Escolha outra data.";
    }

    const abertura = horario.horario_abertura.slice(0, 5);
    const fechamento = horario.horario_fechamento.slice(0, 5);

    if (escolhido.hora < abertura || escolhido.hora > fechamento) {
      return `Insira um horário entre ${abertura} e ${fechamento}`;
    }
  } else if (
    escolhido.hora < HORARIO_PADRAO.abertura ||
    escolhido.hora >= HORARIO_PADRAO.fechamento
  ) {
    return "Insira um horário válido entre 9:00 e 18:00";
  }

  // Para hoje, exige pelo menos a próxima hora cheia (regra que já existia)
  if (escolhido.data === hoje && hh(escolhido.hora) <= hh(horaAgora)) {
    return "Escolha um horário futuro para hoje";
  }

  return null;
};
