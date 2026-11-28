import { describe, expect, it } from "vitest";
import {
  isValidCNPJ,
  isValidCPF,
  isValidCPForCNPJ,
  isValidPhone,
} from "./validators";
import {
  formatCPForCNPJ,
  formatCurrencyBRL,
  formatPhone,
  removeNonNumeric,
} from "./format";

describe("removeNonNumeric", () => {
  it("mantém só os dígitos", () => {
    expect(removeNonNumeric("(11) 98765-4321")).toBe("11987654321");
  });
});

describe("isValidCPF", () => {
  it("aceita CPF válido com ou sem máscara", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("52998224725")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(isValidCPF("529.982.247-26")).toBe(false);
  });

  it("rejeita dígitos repetidos e tamanho errado", () => {
    expect(isValidCPF("111.111.111-11")).toBe(false);
    expect(isValidCPF("1234567890")).toBe(false);
  });
});

describe("isValidCNPJ", () => {
  it("aceita CNPJ válido", () => {
    expect(isValidCNPJ("11.222.333/0001-81")).toBe(true);
  });

  it("rejeita dígito verificador errado e dígitos repetidos", () => {
    expect(isValidCNPJ("11.222.333/0001-82")).toBe(false);
    expect(isValidCNPJ("00.000.000/0000-00")).toBe(false);
  });
});

describe("isValidCPForCNPJ", () => {
  it("decide pelo tamanho", () => {
    expect(isValidCPForCNPJ("52998224725")).toBe(true);
    expect(isValidCPForCNPJ("11222333000181")).toBe(true);
    expect(isValidCPForCNPJ("123")).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("aceita fixo (10) e celular (11) com DDD", () => {
    expect(isValidPhone("(11) 4567-8901")).toBe(true);
    expect(isValidPhone("11987654321")).toBe(true);
  });

  it("rejeita tamanhos fora do padrão", () => {
    expect(isValidPhone("987654321")).toBe(false);
    expect(isValidPhone("5511987654321")).toBe(false);
  });
});

describe("formatadores", () => {
  it("formata telefone celular e fixo", () => {
    expect(formatPhone("11987654321")).toBe("(11) 98765-4321");
    expect(formatPhone("1145678901")).toBe("(11) 4567-8901");
  });

  it("formata CPF ou CNPJ conforme o tamanho", () => {
    expect(formatCPForCNPJ("52998224725")).toBe("529.982.247-25");
    expect(formatCPForCNPJ("11222333000181")).toBe("11.222.333/0001-81");
  });

  it("formata moeda em reais", () => {
    // Intl usa espaço não separável entre "R$" e o valor
    expect(formatCurrencyBRL(1234.5).replace(/\s/g, " ")).toBe("R$ 1.234,50");
    expect(formatCurrencyBRL(0).replace(/\s/g, " ")).toBe("R$ 0,00");
  });
});
