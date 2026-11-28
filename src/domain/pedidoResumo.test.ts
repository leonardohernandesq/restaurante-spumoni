import { describe, expect, it } from "vitest";
import {
  montarMensagemWhatsappLoja,
  montarResumoPedido,
} from "./pedidoResumo";
import type { PedidoCreateDto } from "@/types/pedido";
import type { ProdutoCarrinho } from "@/types/carrinho";

const dados: PedidoCreateDto = {
  nome_cliente: "Maria",
  telefone: "11987654321",
  tipo_entrega: "delivery",
  entrega: "now",
  forma_pagamento: "dinheiro",
  troco: "100",
  data_pedido: "2026-11-25 12:00:00",
  produtos: [],
  endereco_entrega: "Rua A",
  numero: "10",
  bairro: "Centro",
  cep: "08700-000",
};

const itens: ProdutoCarrinho[] = [
  {
    itemId: "10|101|",
    id: 10,
    nome: "Açaí",
    slug: "acai",
    imagem: "",
    quantidade: 2,
    preco: 22.5,
    observacoes: "sem granola",
    atributos: [
      {
        nome: "Tamanho",
        valor: "500ml",
        preco: 20,
        atributo_id: 1,
        valor_atributo_id: 101,
        preco_incluido: true,
      },
    ],
  },
];

describe("montarMensagemWhatsappLoja", () => {
  const link = "https://exemplo.com/admin/pedido/42";
  const resumo = montarResumoPedido(42, dados, itens, {
    subtotal: 45,
    taxaEntrega: 8,
    valorFinal: 53,
  });

  it("inclui itens, observação, pagamento, cliente e o link do admin", () => {
    const msg = montarMensagemWhatsappLoja(42, resumo, link);
    expect(msg).toContain("Pedido 42");
    expect(msg).toContain("2x - Açaí");
    expect(msg).toContain("Obs.: sem granola");
    expect(msg).toContain("DINHEIRO");
    expect(msg).toContain("Maria");
    expect(msg).toContain(link);
    expect(msg).not.toContain("/obrigado");
  });

  it("sem resumo, manda só o número do pedido e o link", () => {
    const msg = montarMensagemWhatsappLoja(42, null, link);
    expect(msg).toContain("pedido nº 42");
    expect(msg).toContain(link);
    expect(msg).not.toContain("Maria");
  });
});

describe("montarResumoPedido", () => {
  const resumo = montarResumoPedido(42, dados, itens, {
    subtotal: 45,
    taxaEntrega: 8,
    valorFinal: 53,
  });

  it("usa o id devolvido pela API e os totais do checkout", () => {
    expect(resumo.id).toBe(42);
    expect(resumo.total_produtos).toBe(45);
    expect(resumo.taxa_entrega).toBe(8);
    expect(resumo.valor_total).toBe(53);
    expect(resumo.status).toBe(1);
  });

  it("copia dados do cliente, entrega e pagamento", () => {
    expect(resumo.nome_cliente).toBe("Maria");
    expect(resumo.bairro).toBe("Centro");
    expect(resumo.forma_pagamento).toBe("dinheiro");
    expect(resumo.troco).toBe(100);
  });

  it("converte os itens do carrinho no formato de produtos do pedido", () => {
    expect(resumo.produtos).toHaveLength(1);
    const [produto] = resumo.produtos;
    expect(produto.produto_nome).toBe("Açaí");
    expect(produto.quantidade).toBe(2);
    expect(produto.observacao).toBe("sem granola");
    expect(produto.atributos[0]).toMatchObject({
      nome_atributo: "Tamanho",
      valor: "500ml",
      preco: 20,
      preco_incluido: true,
    });
  });
});
