import { describe, expect, it } from "vitest";
import { ordenarPorDiaSemana } from "./horarios";

describe("ordenarPorDiaSemana", () => {
  it("ordena de segunda (1) a domingo (7), mesmo vindo como string", () => {
    // Ordem real devolvida pela API
    const api = ["4", "5", "6", "2", "3", "1", "7"].map((dia) => ({ dia_semana: dia }));
    expect(ordenarPorDiaSemana(api).map((h) => h.dia_semana)).toEqual([
      "1", "2", "3", "4", "5", "6", "7",
    ]);
  });

  it("não altera a lista original", () => {
    const lista = [{ dia_semana: 3 }, { dia_semana: 1 }];
    ordenarPorDiaSemana(lista);
    expect(lista[0].dia_semana).toBe(3);
  });
});
