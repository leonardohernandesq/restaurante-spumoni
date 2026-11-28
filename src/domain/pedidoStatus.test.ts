import { describe, expect, it } from "vitest";
import {
  PEDIDO_STATUS,
  PEDIDO_STATUS_LIST,
  saudacao,
  getFormaPagamentoLabel,
  descreverContagemPedidos,
  getNovosPedidos,
  getStatusColor,
  getStatusLabel,
  getTipoEntregaLabel,
  hasStatus,
} from "./pedidoStatus";

describe("pedidoStatus", () => {
  it("lista só novo, finalizado e cancelado", () => {
    expect(PEDIDO_STATUS_LIST).toEqual([1, 4, 0]);
  });

  it("aceita status como número ou string vinda da API", () => {
    expect(getStatusLabel(0)).toBe("Cancelado");
    expect(getStatusLabel("4" as unknown as number)).toBe("Finalizado");
    expect(getStatusLabel(2)).toBe("Desconhecido");
    expect(getStatusColor(9)).toBe("bg-gray-400");
    expect(getStatusLabel(9)).toBe("Desconhecido");
  });

  it("considera cancelado (0) como status válido", () => {
    expect(hasStatus(0)).toBe(true);
    expect(hasStatus("0")).toBe(true);
    expect(hasStatus(undefined)).toBe(false);
    expect(hasStatus(null)).toBe(false);
  });
});

describe("getNovosPedidos", () => {
  const conhecidos = new Set([1, 2]);

  it("retorna só ids desconhecidos com status 'Novo pedido'", () => {
    const pedidos = [
      { id: 1, status: 1 },
      { id: 3, status: 1 },
      { id: "4", status: "1" },
      { id: 5, status: 4 },
    ];
    expect(getNovosPedidos(conhecidos, pedidos).map((p) => p.id)).toEqual([
      3,
      "4",
    ]);
  });

  it("não toca para pedido antigo que reaparece nem para excluído", () => {
    const vistos = new Set([10, 11]);
    expect(
      getNovosPedidos(vistos, [
        { id: 7, status: 1 }, // antigo restaurado
        { id: 12, status: 1, excluido: true },
        { id: 13, status: 1 },
      ]).map((p) => p.id),
    ).toEqual([13]);
  });

  it("ignora pedidos sem id e devolve vazio quando nada mudou", () => {
    expect(getNovosPedidos(conhecidos, [{ status: 1 }])).toEqual([]);
    expect(
      getNovosPedidos(conhecidos, [
        { id: 1, status: 1 },
        { id: 2, status: 1 },
      ]),
    ).toEqual([]);
  });
});

describe("descreverContagemPedidos", () => {
  const contagem = { status: { 0: 78, 1: 162, 4: 3496 }, excluidos: 6 };

  it("sem filtro mostra o total", () => {
    expect(descreverContagemPedidos(3748, { status: [], excluidos: false }, contagem)).toBe(
      "3.748 pedidos",
    );
  });

  it("um filtro usa o nome do status no plural ou singular", () => {
    expect(descreverContagemPedidos(78, { status: [0], excluidos: false }, contagem)).toBe(
      "78 pedidos cancelados",
    );
    expect(descreverContagemPedidos(162, { status: [1], excluidos: false }, contagem)).toBe(
      "162 novos pedidos",
    );
    expect(descreverContagemPedidos(3496, { status: [4], excluidos: false }, contagem)).toBe(
      "3.496 pedidos finalizados",
    );
    expect(descreverContagemPedidos(6, { status: [], excluidos: true }, contagem)).toBe(
      "6 pedidos excluídos",
    );
  });

  it("vários filtros mostram o total e cada parte, na ordem dos status", () => {
    expect(descreverContagemPedidos(246, { status: [1, 0], excluidos: true }, contagem)).toBe(
      "246 pedidos: 78 pedidos cancelados · 162 novos pedidos · 6 pedidos excluídos",
    );
  });

  it("sem contagem da API mostra só o total", () => {
    expect(descreverContagemPedidos(10, { status: [1], excluidos: false })).toBe("10 pedidos");
  });
});

describe("mensagem de concluir (WhatsApp)", () => {
  const msg = PEDIDO_STATUS[4].whatsappMessage;

  it("diz que o pedido foi aceito e está em preparo, não que foi entregue", () => {
    const texto = msg("Cindy Souza", { numero: 3711 });
    expect(texto).toMatch(/^Olá, Cindy!/);
    expect(texto).toContain("*#3711*");
    expect(texto).toContain("*aceito*");
    expect(texto).toContain("sai para a entrega");
    expect(texto).not.toMatch(/conclu|entregue/i);
  });

  it("na retirada fala para buscar na loja", () => {
    expect(msg("Ana", { retirada: true })).toContain("vir buscar aqui na loja");
  });

  it("sem nome não quebra a saudação", () => {
    expect(saudacao("  ")).toBe("Olá!");
  });
});

describe("rótulos do pedido", () => {
  it("traduz a forma de pagamento e mantém valores desconhecidos", () => {
    expect(getFormaPagamentoLabel("pix")).toBe("PIX");
    expect(getFormaPagamentoLabel("CARTAO")).toBe("Cartão");
    expect(getFormaPagamentoLabel("vale")).toBe("vale");
    expect(getFormaPagamentoLabel(undefined)).toBe("—");
  });

  it("diferencia entrega de retirada", () => {
    expect(getTipoEntregaLabel("delivery")).toBe("Delivery (Entrega)");
    expect(getTipoEntregaLabel("takeaway")).toBe("Retirada na loja");
  });
});
