import { describe, expect, it } from "vitest";
import {
  diaSemanaIso,
  formatDateTimeBR,
  tempoDesde,
  isSameDaySaoPaulo,
  parseWallTime,
  timeSaoPaulo,
  toSaoPauloSql,
  todaySaoPaulo,
} from "./datetime";

// 25/11/2026 18:07 UTC = 15:07 em São Paulo (UTC-3, sem horário de verão)
const tarde = new Date("2026-11-25T18:07:08Z");
// 26/11/2026 01:30 UTC = 25/11/2026 22:30 em São Paulo (ainda é dia 25 lá)
const noite = new Date("2026-11-26T01:30:00Z");

describe("horário de São Paulo", () => {
  it("converte para o formato do banco", () => {
    expect(toSaoPauloSql(tarde)).toBe("2026-11-25 15:07:08");
  });

  it("data e hora seguem São Paulo, não UTC", () => {
    expect(todaySaoPaulo(noite)).toBe("2026-11-25");
    expect(timeSaoPaulo(noite)).toBe("22:30");
  });

  it("compara o dia no fuso da loja", () => {
    expect(isSameDaySaoPaulo(tarde, noite)).toBe(true);
    expect(isSameDaySaoPaulo(tarde, new Date("2026-11-26T04:00:00Z"))).toBe(false);
  });
});

describe("parseWallTime / diaSemanaIso", () => {
  it("lê datas da API e do input datetime-local", () => {
    expect(parseWallTime("2026-11-25 15:07:08")).toEqual({ data: "2026-11-25", hora: "15:07" });
    expect(parseWallTime("2026-11-26T10:00")).toEqual({ data: "2026-11-26", hora: "10:00" });
    expect(parseWallTime("2026-11-26")).toEqual({ data: "2026-11-26", hora: "" });
    expect(parseWallTime("lixo")).toBeNull();
  });

  it("dia da semana ISO (1 = segunda, 7 = domingo)", () => {
    expect(diaSemanaIso("2026-11-23")).toBe(1);
    expect(diaSemanaIso("2026-11-25")).toBe(3);
    expect(diaSemanaIso("2026-11-29")).toBe(7);
  });
});

describe("formatDateTimeBR", () => {
  it("formata a string da API sem mudar a hora", () => {
    expect(formatDateTimeBR("2026-11-25 15:07:08")).toBe("25/11/2026, 15:07");
    expect(formatDateTimeBR("2026-11-26T10:00")).toBe("26/11/2026, 10:00");
  });

  it("converte Date para o horário de São Paulo", () => {
    expect(formatDateTimeBR(tarde)).toBe("25/11/2026, 15:07");
  });

  it("devolve vazio para valores ausentes ou inválidos", () => {
    expect(formatDateTimeBR(undefined)).toBe("");
    expect(formatDateTimeBR("")).toBe("");
    expect(formatDateTimeBR(new Date("x"))).toBe("");
  });
});

describe("tempoDesde", () => {
  // 27/11/2026 15:00 em São Paulo (UTC-3) = 18:00 UTC
  const agora = new Date("2026-11-27T18:00:00Z");

  it("mostra minutos e horas para pedidos recentes", () => {
    expect(tempoDesde("2026-11-27 15:00:00", agora)).toBe("agora");
    expect(tempoDesde("2026-11-27 14:48:10", agora)).toBe("há 12 min");
    expect(tempoDesde("2026-11-27 12:30:00", agora)).toBe("há 2 h");
  });

  it("não mostra nada para pedidos antigos, futuros ou sem hora", () => {
    expect(tempoDesde("2026-11-26 14:00:00", agora)).toBeNull();
    expect(tempoDesde("2026-11-27 16:00:00", agora)).toBeNull();
    expect(tempoDesde("2026-11-27", agora)).toBeNull();
    expect(tempoDesde(undefined, agora)).toBeNull();
  });
});
