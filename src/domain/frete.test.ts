import { describe, expect, it } from "vitest";
import { calcularTaxaEntrega, findFrete, isFreteAlterado } from "./frete";

const fretes = [
  { id: 1, bairro: "Centro", cidade: "Mogi das Cruzes", preco: "8.00" },
  { id: 2, bairro: "Centro", cidade: "Suzano", preco: "12.50" },
  { id: 3, bairro: "Jardim Santista", cidade: "Mogi das Cruzes", preco: "10" },
];

describe("findFrete", () => {
  it("usa cidade + bairro para escolher entre bairros com o mesmo nome", () => {
    expect(findFrete(fretes, "Suzano", "Centro")?.id).toBe(2);
    expect(findFrete(fretes, "Mogi das Cruzes", "Centro")?.id).toBe(1);
  });

  it("ignora maiúsculas e espaços nas pontas", () => {
    expect(findFrete(fretes, " mogi das cruzes ", "jardim santista")?.id).toBe(3);
  });

  it("não encontra quando a cidade não bate ou o bairro está vazio", () => {
    expect(findFrete(fretes, "Suzano", "Jardim Santista")).toBeUndefined();
    expect(findFrete(fretes, "Suzano", "")).toBeUndefined();
  });
});

describe("calcularTaxaEntrega", () => {
  it("devolve o preço do frete para delivery", () => {
    expect(calcularTaxaEntrega(fretes, "Suzano", "Centro", "delivery")).toBe(12.5);
  });

  it("é zero para retirada e para bairro sem frete", () => {
    expect(calcularTaxaEntrega(fretes, "Suzano", "Centro", "takeaway")).toBe(0);
    expect(calcularTaxaEntrega(fretes, "Suzano", "Inexistente", "delivery")).toBe(0);
  });

  it("é zero quando o preço cadastrado não é número", () => {
    const quebrado = [{ bairro: "X", cidade: "Y", preco: "" }];
    expect(calcularTaxaEntrega(quebrado, "Y", "X", "delivery")).toBe(0);
  });
});

describe("isFreteAlterado", () => {
  const original = { id: 1, bairro: "Centro", cidade: "Suzano", preco: "10" };

  it("detecta mudança de cidade (antes era ignorada)", () => {
    expect(isFreteAlterado(original, { ...original, cidade: "Poá" })).toBe(true);
  });

  it("detecta mudança de bairro e de preço", () => {
    expect(isFreteAlterado(original, { ...original, bairro: "Vila" })).toBe(true);
    expect(isFreteAlterado(original, { ...original, preco: "11" })).toBe(true);
  });

  it("não marca como alterado quando nada mudou", () => {
    expect(isFreteAlterado(original, { ...original })).toBe(false);
  });
});
