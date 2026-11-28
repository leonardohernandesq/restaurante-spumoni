import { describe, expect, it } from "vitest";
import {
  calcularEstatisticas,
  calcularPedidos,
  escolherGranularidade,
  type StatsPedidoRaw,
  type StatsRaw,
} from "./estatisticas";

const pedido = (p: Partial<StatsPedidoRaw> & { id: number; data: string }): StatsPedidoRaw => ({
  status: 4,
  tipo: "delivery",
  entrega: "now",
  pagamento: "pix",
  taxa: 5,
  bairro: "Centro",
  cliente: `c${p.id}`,
  ...p,
});

// Marmitex R$ 20 (+ adicional R$ 3), Açaí: tamanho "incluído" de R$ 30
const base: StatsRaw = {
  produtos: [
    { id: 1, nome: "Marmitex", preco: 20, categoria: 10 },
    { id: 2, nome: "Açaí", preco: 0, categoria: 11 },
  ],
  categorias: [
    { id: 10, nome: "Marmitex" },
    { id: 11, nome: "Potes" },
  ],
  pedidos: [
    // segunda 23/11, 12h — 2 marmitex com adicional + açaí, entrega
    pedido({ id: 100, data: "2026-11-23 12:10:00", cliente: "ana" }),
    // terça 24/11, 19h — retirada (taxa gravada não conta)
    pedido({ id: 101, data: "2026-11-24 19:30:00", tipo: "takeaway", pagamento: "dinheiro", cliente: "ana" }),
    // cancelado
    pedido({ id: 102, data: "2026-11-24 20:00:00", status: 0, cliente: "bia" }),
    // novo (status 1): conta por padrão, não com "só finalizados"
    pedido({ id: 103, data: "2026-11-25 12:00:00", status: 1, entrega: "booking", bairro: " centro ", cliente: "caio" }),
    // período anterior
    pedido({ id: 90, data: "2026-11-16 12:00:00" }),
  ],
  itens: [
    { id: 1, pedido: 100, produto: 1, qtd: 2 },
    { id: 2, pedido: 100, produto: 2, qtd: 1 },
    { id: 3, pedido: 101, produto: 1, qtd: 1 },
    { id: 4, pedido: 102, produto: 1, qtd: 1 },
    { id: 5, pedido: 103, produto: 99, qtd: 1 }, // produto removido
    { id: 6, pedido: 90, produto: 1, qtd: 1 },
  ],
  atributos: [
    { item: 1, preco: 3, incluido: false },
    { item: 2, preco: 30, incluido: true },
  ],
};

const atual = { de: "2026-11-23", ate: "2026-11-26" };
const anterior = { de: "2026-11-16", ate: "2026-11-19" };

describe("calcularPedidos", () => {
  it("usa a regra de preço do site e ignora a taxa na retirada", () => {
    const [p100, p101] = calcularPedidos(base);
    // (20 + 3) x 2 + 30 = 76, + 5 de entrega
    expect(p100).toMatchObject({ subtotal: 76, taxa: 5, total: 81 });
    expect(p101).toMatchObject({ subtotal: 20, taxa: 0, total: 20 });
  });
});

describe("preço gravado na venda (B8)", () => {
  it("usa o preço gravado em vez do preço atual do produto", () => {
    // Marmitex hoje custa R$ 20, mas foi vendido a R$ 18 (preço da época)
    const comPrecoGravado: StatsRaw = {
      ...base,
      itens: base.itens.map((i) => (i.id === 3 ? { ...i, precoUnitario: 18 } : i)),
    };
    const p101 = calcularPedidos(comPrecoGravado).find((p) => p.raw.id === 101);
    expect(p101).toMatchObject({ subtotal: 18, total: 18 });
  });
});

describe("calcularEstatisticas", () => {
  const e = calcularEstatisticas(base, atual, anterior);

  it("resumo do período (cancelado fica de fora do faturamento)", () => {
    // 81 + 20 + (produto removido: R$ 0 + 5 de entrega)
    expect(e.resumo).toMatchObject({
      faturamento: 106,
      pedidos: 3,
      taxasEntrega: 10,
      ticketMedio: 35.33,
      cancelados: 1,
      valorCancelado: 25,
      taxaCancelamento: 0.25,
      clientesUnicos: 2,
      clientesRecorrentes: 1,
      agendados: 1,
      itensVendidos: 5,
    });
    expect(e.resumo.pedidosDeRecorrentes).toBeCloseTo(2 / 3);
  });

  it("compara com o período anterior", () => {
    expect(e.anterior).toMatchObject({ faturamento: 25, pedidos: 1 });
    expect(e.variacao.faturamento).toBeCloseTo(3.24); // 106 / 25 - 1
    expect(e.variacao.pedidos).toBe(2);
  });

  it("série diária mostra o dia da semana no detalhe", () => {
    expect(e.serie.map((p) => p.detalhe)).toEqual([
      "23/11 (segunda)",
      "24/11 (terça)",
      "25/11 (quarta)",
      "26/11 (quinta)",
    ]);
  });

  it("série diária com os dias sem pedido zerados", () => {
    expect(e.granularidade).toBe("dia");
    expect(e.serie.map((p) => [p.label, p.pedidos, p.faturamento])).toEqual([
      ["23/11", 1, 81],
      ["24/11", 1, 20],
      ["25/11", 1, 5],
      ["26/11", 0, 0],
    ]);
  });

  it("pratos mais vendidos, com produto removido identificado", () => {
    expect(e.pratos[0]).toMatchObject({
      nome: "Marmitex",
      categoria: "Marmitex",
      quantidade: 3,
      faturamento: 66,
      pedidos: 2,
    });
    expect(e.pratos.find((p) => p.produtoId === 99)?.nome).toMatch(/removido/);
    expect(e.categorias[0]).toMatchObject({ nome: "Marmitex", faturamento: 66 });
  });

  it("dias da semana com média por ocorrência", () => {
    const seg = e.diasSemana[0];
    expect(seg).toMatchObject({ label: "Seg", pedidos: 1, faturamento: 81, ocorrencias: 1 });
    expect(e.diasSemana[6]).toMatchObject({ label: "Dom", ocorrencias: 0, mediaPedidos: 0 });
  });

  it("horas só na faixa com movimento", () => {
    expect(e.horas[0].label).toBe("12h");
    expect(e.horas[e.horas.length - 1].label).toBe("19h");
    expect(e.horas.find((h) => h.hora === 12)?.pedidos).toBe(2);
  });

  it("pagamento, tipo de entrega e bairros (normalizados, só entregas)", () => {
    expect(e.pagamentos.map((p) => [p.label, p.pedidos])).toEqual([
      ["Pix", 2],
      ["Dinheiro", 1],
    ]);
    expect(e.tiposEntrega.map((t) => t.label)).toEqual(["Entrega", "Retirada"]);
    expect(e.bairros).toEqual([{ nome: "Centro", pedidos: 2, faturamento: 86, taxas: 10 }]);
  });

  it("'só finalizados' ignora os pedidos ainda em aberto", () => {
    const f = calcularEstatisticas(base, atual, anterior, { somenteFinalizados: true });
    expect(f.resumo.pedidos).toBe(2);
    expect(f.resumo.faturamento).toBe(101);
  });

  it("período sem pedidos não quebra", () => {
    const vazio = calcularEstatisticas({ ...base, pedidos: [], itens: [] }, atual, anterior);
    expect(vazio.resumo).toMatchObject({ faturamento: 0, pedidos: 0, ticketMedio: 0 });
    expect(vazio.variacao.faturamento).toBeNull();
    expect(vazio.horas).toEqual([]);
  });
});

describe("escolherGranularidade", () => {
  it("dia, semana ou mês conforme o tamanho", () => {
    expect(escolherGranularidade({ de: "2026-11-01", ate: "2026-11-30" })).toBe("dia");
    expect(escolherGranularidade({ de: "2026-07-01", ate: "2026-11-26" })).toBe("semana");
    expect(escolherGranularidade({ de: "2026-01-01", ate: "2026-11-26" })).toBe("mes");
  });
});
