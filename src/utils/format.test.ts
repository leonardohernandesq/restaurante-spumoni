import { describe, expect, it } from "vitest";
import { buildWhatsappUrl, toWhatsappNumber } from "./format";

describe("toWhatsappNumber", () => {
  it("adiciona o 55 em celular e fixo sem DDI", () => {
    expect(toWhatsappNumber("11987654321")).toBe("5511987654321");
    expect(toWhatsappNumber("(11) 4567-8901")).toBe("551145678901");
  });

  it("não duplica o DDI quando já existe", () => {
    expect(toWhatsappNumber("5511987654321")).toBe("5511987654321");
    expect(toWhatsappNumber("+55 (11) 98765-4321")).toBe("5511987654321");
  });
});

describe("buildWhatsappUrl", () => {
  it("monta a URL com número normalizado e texto codificado", () => {
    expect(buildWhatsappUrl("11987654321", "Olá & tchau")).toBe(
      "https://api.whatsapp.com/send?phone=5511987654321&text=Ol%C3%A1%20%26%20tchau",
    );
  });

  it("mantém os emojis codificados e omite o texto vazio", () => {
    expect(buildWhatsappUrl("11987654321", "Oi 😊")).toBe(
      "https://api.whatsapp.com/send?phone=5511987654321&text=Oi%20%F0%9F%98%8A",
    );
    expect(buildWhatsappUrl("11987654321", "")).toBe(
      "https://api.whatsapp.com/send?phone=5511987654321",
    );
  });
});
