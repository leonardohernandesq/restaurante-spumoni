import { describe, expect, it } from "vitest";
import {
  diasNoIntervalo,
  inicioDaSemana,
  isDataValida,
  periodoDoPreset,
  periodoPersonalizado,
  validarIntervalo,
} from "./periodo";

describe("periodoDoPreset", () => {
  it("hoje: só o dia, comparado com o mesmo dia da semana passada", () => {
    expect(periodoDoPreset("hoje", "2026-11-27")).toEqual({
      tipo: "hoje",
      atual: { de: "2026-11-27", ate: "2026-11-27" },
      anterior: { de: "2026-11-20", ate: "2026-11-20" },
    });
  });

  it("semana: de segunda até hoje, comparada com a semana passada", () => {
    // 26/11/2026 é quinta-feira
    expect(periodoDoPreset("semana", "2026-11-26")).toEqual({
      tipo: "semana",
      atual: { de: "2026-11-23", ate: "2026-11-26" },
      anterior: { de: "2026-11-16", ate: "2026-11-19" },
    });
  });

  it("mês: do dia 1 até hoje, comparado com o mesmo trecho do mês passado", () => {
    expect(periodoDoPreset("mes", "2026-11-26")).toMatchObject({
      atual: { de: "2026-11-01", ate: "2026-11-26" },
      anterior: { de: "2026-10-01", ate: "2026-10-26" },
    });
  });

  it("mês: 31 vira o último dia do mês anterior", () => {
    expect(periodoDoPreset("mes", "2026-03-31").anterior).toEqual({
      de: "2026-02-01",
      ate: "2026-02-28",
    });
  });

  it("trimestre e ano", () => {
    expect(periodoDoPreset("trimestre", "2026-11-26")).toMatchObject({
      atual: { de: "2026-10-01", ate: "2026-11-26" },
      anterior: { de: "2026-07-01", ate: "2026-08-26" },
    });
    expect(periodoDoPreset("ano", "2026-11-26")).toMatchObject({
      atual: { de: "2026-01-01", ate: "2026-11-26" },
      anterior: { de: "2025-01-01", ate: "2025-11-26" },
    });
  });
});

describe("periodoPersonalizado", () => {
  it("compara com o mesmo número de dias logo antes", () => {
    expect(periodoPersonalizado({ de: "2026-11-10", ate: "2026-11-19" }).anterior).toEqual({
      de: "2026-10-31",
      ate: "2026-11-09",
    });
  });
});

describe("helpers", () => {
  it("conta os dias com as duas pontas", () => {
    expect(diasNoIntervalo({ de: "2026-11-01", ate: "2026-11-01" })).toBe(1);
    expect(diasNoIntervalo({ de: "2026-02-01", ate: "2026-03-01" })).toBe(29);
  });

  it("acha a segunda-feira (domingo pertence à semana anterior)", () => {
    expect(inicioDaSemana("2026-11-29")).toBe("2026-11-23");
    expect(inicioDaSemana("2026-11-23")).toBe("2026-11-23");
  });

  it("valida datas e intervalos", () => {
    expect(isDataValida("2026-02-30")).toBe(false);
    expect(isDataValida("2026-11-26")).toBe(true);
    expect(validarIntervalo("2026-11-10", "2026-11-01", "2026-11-26")).toMatch(/antes/);
    expect(validarIntervalo("2026-11-10", "2026-11-30", "2026-11-26")).toMatch(/futuro/);
    expect(validarIntervalo("2024-01-01", "2026-11-26", "2026-11-26")).toMatch(/máximo/);
    expect(validarIntervalo("x", "2026-11-01", "2026-11-26")).toMatch(/inválidas/);
    expect(validarIntervalo("2026-11-01", "2026-11-26", "2026-11-26")).toBeNull();
  });
});
