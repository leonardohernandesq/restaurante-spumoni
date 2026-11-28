import { describe, expect, it } from "vitest";
import { mapPedidoApi } from "./pedido";
import type { PedidoApi } from "@/types/pedido";

// Formato real devolvido pela API (tudo string, 0/1 para booleanos)
const api: PedidoApi = {
  id: "560",
  nome_cliente: "Maria",
  telefone: "11987654321",
  tipo_entrega: "delivery",
  entrega: "now",
  data_entrega: null,
  endereco_entrega: "Rua A",
  bairro: "Centro",
  cep: "08700-000",
  numero: "10",
  complemento: "",
  referencia: null,
  distancia: null,
  taxa_entrega: "8.00",
  total_produtos: "20.00",
  valor_total: "28.00",
  status: "1",
  forma_pagamento: "pix",
  troco: "",
  nota_fiscal: null,
  data_pedido: "2026-11-25 15:07:08",
  produtos: [
    {
      id: "900",
      pedido_id: "560",
      produto_id: "10",
      quantidade: "2",
      observacao: null,
      produto_nome: "Açaí",
      preco_base: "10.00",
      atributos: [
        {
          id: "1",
          pedido_item_id: "900",
          atributo_id: "3",
          valor_atributo_id: "101",
          nome_atributo: "Tamanho",
          valor: "500ml",
          preco: "22.00",
          preco_incluido: "1",
        },
      ],
    },
  ],
};

describe("mapPedidoApi", () => {
  const pedido = mapPedidoApi(api);

  it("converte números e status", () => {
    expect(pedido.id).toBe(560);
    expect(pedido.status).toBe(1);
    expect(pedido.taxa_entrega).toBe(8);
    expect(pedido.total_produtos).toBe(20);
    expect(pedido.valor_total).toBe(28);
  });

  it("troca vazio/null por undefined nos campos opcionais", () => {
    expect(pedido.troco).toBeUndefined();
    expect(pedido.complemento).toBeUndefined();
    expect(pedido.referencia).toBeUndefined();
    expect(pedido.data_entrega).toBeUndefined();
    expect(pedido.distancia).toBeUndefined();
  });

  it("normaliza itens e atributos", () => {
    const [item] = pedido.produtos;
    expect(item).toMatchObject({
      id: 900,
      quantidade: 2,
      observacao: "",
      preco_base: 10,
    });
    expect(item.atributos[0]).toMatchObject({
      preco: 22,
      preco_incluido: true,
      valor_atributo_id: 101,
    });
  });

  it("lê a marca de excluído (0/1, string ou ausente)", () => {
    expect(pedido.excluido).toBe(false);
    expect(mapPedidoApi({ ...api, excluido: "1", excluido_em: "2026-11-27 10:00:00" })).toMatchObject({
      excluido: true,
      excluido_em: "2026-11-27 10:00:00",
    });
    expect(mapPedidoApi({ ...api, excluido: 0 }).excluido).toBe(false);
    expect(mapPedidoApi({ ...api, excluido: null }).excluido).toBe(false);
  });

  it("aguenta pedido sem produtos e status 0 (cancelado)", () => {
    const vazio = mapPedidoApi({ ...api, status: "0", produtos: null });
    expect(vazio.status).toBe(0);
    expect(vazio.produtos).toEqual([]);
  });
});
