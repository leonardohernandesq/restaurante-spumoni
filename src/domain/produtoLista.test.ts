import { describe, expect, it } from "vitest";
import { diaDoProdutoHoje, produtoCombina, quandoDia, rotuloStatus, statusDoProduto } from "./produtoLista";

describe("diaDoProdutoHoje", () => {
  it("usa 1 = domingo … 7 = sábado", () => {
    expect(diaDoProdutoHoje("2026-11-29")).toBe(1); // domingo
    expect(diaDoProdutoHoje("2026-11-30")).toBe(2); // segunda
    expect(diaDoProdutoHoje("2026-11-28")).toBe(7); // sábado
  });
});

describe("statusDoProduto", () => {
  const sexta = 6;

  it("ativo e marcado para hoje = no cardápio", () => {
    expect(statusDoProduto({ active: true, available_days: [2, 6] }, sexta)).toBe("hoje");
  });

  it("ativo fora do dia = fora", () => {
    expect(statusDoProduto({ active: true, available_days: [1] }, sexta)).toBe("fora");
    expect(statusDoProduto({ active: true, available_days: [] }, sexta)).toBe("fora");
  });

  it("inativo vale mais que o dia", () => {
    expect(statusDoProduto({ active: false, available_days: [6] }, sexta)).toBe("inativo");
  });
});

describe("produtoCombina", () => {
  const bife = { name: "Bife Acebolado", description: "Arroz, feijão e salada" };

  it("acha por nome ou descrição, sem acento", () => {
    expect(produtoCombina(bife, "acebolado")).toBe(true);
    expect(produtoCombina(bife, "FEIJAO")).toBe(true);
    expect(produtoCombina(bife, "frango")).toBe(false);
    expect(produtoCombina(bife, "  ")).toBe(true);
  });
});

describe("rotuloStatus / quandoDia", () => {
  it("fala hoje ou o nome do dia", () => {
    expect(quandoDia(6, 6)).toBe("hoje");
    expect(quandoDia(1, 6)).toBe("no domingo");
    expect(quandoDia(4, 6)).toBe("na quarta");
    expect(quandoDia(7, 6)).toBe("no sábado");
  });

  it("só o status de cardápio muda com o dia", () => {
    expect(rotuloStatus("hoje", 6, 6)).toBe("No cardápio hoje");
    expect(rotuloStatus("hoje", 2, 6)).toBe("No cardápio na segunda");
    expect(rotuloStatus("inativo", 2, 6)).toBe("Inativo");
  });
});
