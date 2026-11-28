import { describe, expect, it } from "vitest";
import type { ProdutoCarrinho } from "@/types/carrinho";
import {
  checkoutVazio,
  descreverEndereco,
  formatarCep,
  isEnderecoCompleto,
  montarPedidoDto,
  validarCheckout,
  isTelefoneValido,
  type CheckoutForm,
  type EnderecoEntrega,
} from "./checkout";

const endereco: EnderecoEntrega = {
  rua: "Rua A",
  numero: "10",
  complemento: "Apto 2",
  cep: "01234-567",
  cidade: "São Paulo",
  bairro: "Centro",
  referencia: "",
};

const form = (parcial: Partial<CheckoutForm> = {}): CheckoutForm => ({
  ...checkoutVazio(),
  nome: "Ana",
  telefone: "11999998888",
  endereco,
  ...parcial,
});

const produto: ProdutoCarrinho = {
  itemId: "1",
  id: 7,
  nome: "Marmitex",
  slug: "marmitex",
  imagem: "",
  quantidade: 2,
  preco: 25,
  observacoes: "sem cebola",
  atributos: [
    {
      nome: "Tamanho",
      valor: "G",
      preco: 5,
      atributo_id: 3,
      valor_atributo_id: 9,
      preco_incluido: false,
    },
  ],
};

describe("formatarCep", () => {
  it("formata com hífen e corta em 8 dígitos", () => {
    expect(formatarCep("01234567")).toBe("01234-567");
    expect(formatarCep("0123")).toBe("0123");
    expect(formatarCep("01234-56789")).toBe("01234-567");
    expect(formatarCep("ab12")).toBe("12");
  });
});

describe("endereço", () => {
  it("exige rua, número, CEP, cidade e bairro", () => {
    expect(isEnderecoCompleto(endereco)).toBe(true);
    expect(isEnderecoCompleto({ ...endereco, bairro: "" })).toBe(false);
    expect(isEnderecoCompleto({ ...endereco, complemento: "" })).toBe(true);
  });

  it("descreve o endereço com referência", () => {
    expect(descreverEndereco(endereco)).toBe(
      "Rua A, 10, Apto 2, São Paulo, Centro, 01234-567",
    );
    expect(descreverEndereco({ ...endereco, referencia: "Igreja" })).toContain(
      "| Igreja",
    );
    expect(descreverEndereco({ ...endereco, rua: "" })).toBe("");
  });
});

describe("validarCheckout", () => {
  it("aceita um formulário completo", () => {
    expect(validarCheckout(form())).toBeNull();
  });

  it("exige endereço só na entrega", () => {
    const semEndereco = { endereco: { ...endereco, rua: "" } };
    expect(validarCheckout(form(semEndereco))?.campo).toBe("endereco");
    expect(
      validarCheckout(form({ ...semEndereco, tipoEntrega: "takeaway" })),
    ).toBeNull();
  });

  it("exige nome e telefone", () => {
    expect(validarCheckout(form({ nome: "  " }))?.campo).toBe("nome");
    expect(validarCheckout(form({ telefone: "" }))?.campo).toBe("telefone");
  });

  it("exige o WhatsApp com DDD", () => {
    expect(validarCheckout(form({ telefone: "959147448" }))?.campo).toBe("telefone");
    expect(validarCheckout(form({ telefone: "1145678901" }))).toBeNull();
  });
});

describe("isTelefoneValido", () => {
  it("aceita (DD) 99999-9999 e (DD) 9999-9999", () => {
    expect(isTelefoneValido("11987654321")).toBe(true);
    expect(isTelefoneValido("(11) 98765-4321")).toBe(true);
    expect(isTelefoneValido("1145678901")).toBe(true);
    expect(isTelefoneValido("(11) 4567-8901")).toBe(true);
  });

  it("recusa sem DDD, DDD com 0 ou celular sem o 9", () => {
    expect(isTelefoneValido("959147448")).toBe(false);
    expect(isTelefoneValido("987654321")).toBe(false);
    expect(isTelefoneValido("01987654321")).toBe(false);
    expect(isTelefoneValido("11887654321")).toBe(false);
    expect(isTelefoneValido("119876543210")).toBe(false);
    expect(isTelefoneValido("")).toBe(false);
  });
});

describe("montarPedidoDto", () => {
  it("monta itens e endereço na entrega", () => {
    const dto = montarPedidoDto(form(), [produto], 8, "2026-11-25 12:00:00");

    expect(dto).toMatchObject({
      nome_cliente: "Ana",
      tipo_entrega: "delivery",
      taxa_entrega: 8,
      endereco_entrega: "Rua A",
      bairro: "Centro",
      cep: "01234-567",
      data_pedido: "2026-11-25 12:00:00",
    });
    expect(dto.produtos).toEqual([
      {
        produto_id: 7,
        quantidade: 2,
        observacao: "sem cebola",
        atributos: [
          { atributo_id: 3, valor_atributo_id: 9, preco_incluido: false },
        ],
      },
    ]);
  });

  it("não manda endereço na retirada", () => {
    const dto = montarPedidoDto(form({ tipoEntrega: "takeaway" }), [], 8, "x");
    expect(dto.endereco_entrega).toBeUndefined();
    expect(dto.taxa_entrega).toBeUndefined();
  });

  it("só manda data agendada e troco quando fazem sentido", () => {
    const agora = montarPedidoDto(
      form({ entrega: "now", dataEntrega: "2026-11-26T12:00", troco: "50" }),
      [],
      0,
      "x",
    );
    expect(agora.data_entrega).toBeUndefined();
    expect(agora.troco).toBeUndefined();

    const agendado = montarPedidoDto(
      form({
        entrega: "booking",
        dataEntrega: "2026-11-26T12:00",
        formaPagamento: "dinheiro",
        troco: "50",
      }),
      [],
      0,
      "x",
    );
    expect(agendado.data_entrega).toBe("2026-11-26T12:00");
    expect(agendado.troco).toBe("50");
  });
});
