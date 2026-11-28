import { describe, expect, it } from "vitest";
import { transformString } from "./transformString";
import { getDiaSemana } from "./getDiaSemana";

describe("transformString", () => {
  it("gera slug sem acentos, minúsculo e com hífens", () => {
    expect(transformString("Pratos do Dia")).toBe("pratos-do-dia");
    expect(transformString("Açaí & Sorvetes")).toBe("acai-sorvetes");
  });

  it("remove espaços nas pontas e hífens repetidos", () => {
    expect(transformString("  Bebidas -- Geladas  ")).toBe("bebidas-geladas");
  });
});

describe("getDiaSemana", () => {
  it("converte número ou string (1 = segunda, 7 = domingo)", () => {
    expect(getDiaSemana(1)).toBe("Segunda-feira");
    expect(getDiaSemana("7")).toBe("Domingo");
  });

  it("devolve 'Desconhecido' fora do intervalo", () => {
    expect(getDiaSemana(0)).toBe("Desconhecido");
    expect(getDiaSemana("abc")).toBe("Desconhecido");
  });
});
