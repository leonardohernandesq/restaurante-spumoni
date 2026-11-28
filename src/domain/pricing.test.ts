import { describe, expect, it } from "vitest";
import {
  arredondar,
  calcularPrecoUnitario,
  calcularSubtotal,
  calcularTotaisDoPedido,
  calcularTotalPedido,
  isPrecoIncluido,
  toNumber,
} from "./pricing";

describe("calcularPrecoUnitario", () => {
  it("sem atributos, é o preço base", () => {
    expect(calcularPrecoUnitario("28.00", [])).toBe(28);
  });

  it("adicional soma ao preço base", () => {
    expect(
      calcularPrecoUnitario(20, [
        { preco: "2.00", preco_incluido: 0 },
        { preco: 3, preco_incluido: false },
      ]),
    ).toBe(25);
  });

  it("'preço incluído' substitui o preço base", () => {
    expect(
      calcularPrecoUnitario(10, [{ preco: "18.00", preco_incluido: 1 }]),
    ).toBe(18);
  });

  it("adicional depois do 'incluído' soma ao preço substituído", () => {
    expect(
      calcularPrecoUnitario(10, [
        { preco: 18, preco_incluido: true },
        { preco: 4, preco_incluido: "0" },
      ]),
    ).toBe(22);
  });

  it("'incluído' depois de um adicional descarta o adicional (regra atual, igual ao backend)", () => {
    expect(
      calcularPrecoUnitario(10, [
        { preco: 4, preco_incluido: 0 },
        { preco: 18, preco_incluido: "1" },
      ]),
    ).toBe(18);
  });

  it("valores inválidos contam como zero", () => {
    expect(calcularPrecoUnitario("", [{ preco: "abc", preco_incluido: 0 }])).toBe(0);
  });
});

describe("totais", () => {
  it("subtotal soma preço x quantidade sem erro de ponto flutuante", () => {
    expect(
      calcularSubtotal([
        { precoUnitario: 0.1, quantidade: 1 },
        { precoUnitario: 0.2, quantidade: 1 },
      ]),
    ).toBe(0.3);
    expect(
      calcularSubtotal([
        { precoUnitario: 22.5, quantidade: 2 },
        { precoUnitario: 15, quantidade: 3 },
      ]),
    ).toBe(90);
  });

  it("total do pedido soma a taxa (string ou número)", () => {
    expect(calcularTotalPedido(90, "8.50")).toBe(98.5);
    expect(calcularTotalPedido(90, undefined)).toBe(90);
  });

  it("calcula os totais de um pedido vindo da API", () => {
    const { itens, subtotal, taxaEntrega, total } = calcularTotaisDoPedido(
      [
        {
          preco_base: "10.00",
          quantidade: 2,
          atributos: [{ preco: "18.00", preco_incluido: 1 }],
        },
        { preco_base: "5.00", quantidade: 1, atributos: [] },
      ],
      "7.00",
    );

    expect(itens.map((i) => i.total)).toEqual([36, 5]);
    expect(subtotal).toBe(41);
    expect(taxaEntrega).toBe(7);
    expect(total).toBe(48);
  });
});

describe("auxiliares", () => {
  it("toNumber aceita string, número e vazio", () => {
    expect(toNumber("12.5")).toBe(12.5);
    expect(toNumber(3)).toBe(3);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber("x")).toBe(0);
  });

  it("isPrecoIncluido entende os formatos da API e do carrinho", () => {
    expect([true, 1, "1", "true"].map(isPrecoIncluido)).toEqual([true, true, true, true]);
    expect([false, 0, "0", null, undefined].map(isPrecoIncluido)).toEqual([
      false, false, false, false, false,
    ]);
  });

  it("arredondar trabalha em centavos", () => {
    expect(arredondar(1.005)).toBe(1.01);
    expect(arredondar(10)).toBe(10);
  });
});
