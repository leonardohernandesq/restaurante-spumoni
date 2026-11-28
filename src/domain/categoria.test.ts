import { describe, expect, it } from "vitest";
import { ordenarComDestaque } from "./categoria";

describe("ordenarComDestaque", () => {
  it("coloca 'Pratos do Dia' primeiro e mantém a ordem do resto", () => {
    const nomes = ["Marmitex", "Bebidas", "Pratos do Dia", "Porções"];
    expect(ordenarComDestaque(nomes, (n) => n)).toEqual([
      "Pratos do Dia",
      "Marmitex",
      "Bebidas",
      "Porções",
    ]);
  });

  it("não altera a lista original nem quebra sem destaque", () => {
    const itens = [{ nome: "B" }, { nome: "A" }];
    expect(ordenarComDestaque(itens, (i) => i.nome)).toEqual(itens);
    expect(itens[0].nome).toBe("B");
  });
});
