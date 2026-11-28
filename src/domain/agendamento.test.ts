import { describe, expect, it } from "vitest";
import { validarAgendamento } from "./agendamento";

// Quarta, 25/11/2026, 11:10 em São Paulo
const agora = new Date("2026-11-25T14:10:00Z");

// Mesmo formato da API: seg a sáb 09:30–15:30, domingo fechado
const horarios = [1, 2, 3, 4, 5, 6].map((dia) => ({
  dia_semana: String(dia),
  horario_abertura: "09:30:00",
  horario_fechamento: "15:30:00",
}));

describe("validarAgendamento", () => {
  it("aceita um horário dentro do funcionamento", () => {
    expect(validarAgendamento("2026-11-26T10:00", agora, horarios)).toBeNull();
    expect(validarAgendamento("2026-11-26T15:30", agora, horarios)).toBeNull();
  });

  it("recusa data no passado", () => {
    expect(validarAgendamento("2026-11-24T10:00", agora, horarios)).toBe(
      "A data não pode ser no passado",
    );
  });

  it("recusa horário fora do funcionamento daquele dia", () => {
    expect(validarAgendamento("2026-11-26T09:00", agora, horarios)).toBe(
      "Insira um horário entre 09:30 e 15:30",
    );
    expect(validarAgendamento("2026-11-26T17:00", agora, horarios)).toBe(
      "Insira um horário entre 09:30 e 15:30",
    );
  });

  it("recusa dia sem horário cadastrado", () => {
    expect(validarAgendamento("2026-11-29T10:00", agora, horarios)).toBe(
      "Não abrimos neste dia. Escolha outra data.",
    );
  });

  it("para hoje, exige a partir da próxima hora", () => {
    expect(validarAgendamento("2026-11-25T11:40", agora, horarios)).toBe(
      "Escolha um horário futuro para hoje",
    );
    expect(validarAgendamento("2026-11-25T12:00", agora, horarios)).toBeNull();
  });

  it("sem horários carregados, usa a regra antiga de 9h às 18h", () => {
    expect(validarAgendamento("2026-11-29T10:00", agora, [])).toBeNull();
    expect(validarAgendamento("2026-11-29T18:00", agora, [])).toBe(
      "Insira um horário válido entre 9:00 e 18:00",
    );
  });

  it("recusa valor vazio ou inválido", () => {
    expect(validarAgendamento("", agora, horarios)).toBe(
      "Informe uma data e hora válidas",
    );
  });
});
