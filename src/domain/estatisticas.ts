/**
 * Estatísticas do admin, calculadas no servidor Next a partir dos dados
 * brutos de GET /stats/pedidos. Só os agregados vão para o navegador.
 *
 * Preço: o gravado na venda (B8, pedidos a partir de 26/11/2026). Pedidos
 * antigos, sem preço gravado, usam a regra do site (`domain/pricing`) com os
 * preços ATUAIS de produtos e atributos.
 */
import { arredondar, calcularPrecoUnitario, calcularTotalItem } from "./pricing";
import { diaSemanaIso } from "./datetime";
import { diasNoIntervalo, inicioDaSemana, somarDias, type Intervalo } from "./periodo";

/* ---------- Dados brutos (API PHP) ---------- */

export interface StatsPedidoRaw {
  id: number;
  /** "YYYY-MM-DD HH:MM:SS", hora de São Paulo. */
  data: string;
  status: number;
  tipo: string;
  entrega: string;
  pagamento: string;
  taxa: number;
  bairro: string | null;
  /** Hash do telefone (nunca o número). */
  cliente: string | null;
}

export interface StatsItemRaw {
  id: number;
  pedido: number;
  produto: number;
  qtd: number;
  /** Preço unitário gravado na venda (B8). `null`/ausente em pedidos antigos. */
  precoUnitario?: number | null;
}

export interface StatsAtributoRaw {
  item: number;
  preco: number;
  incluido: boolean;
}

export interface StatsProdutoRaw {
  id: number;
  nome: string;
  preco: number;
  categoria: number | null;
}

export interface StatsCategoriaRaw {
  id: number;
  nome: string;
}

export interface StatsRaw {
  pedidos: StatsPedidoRaw[];
  itens: StatsItemRaw[];
  atributos: StatsAtributoRaw[];
  produtos: StatsProdutoRaw[];
  categorias: StatsCategoriaRaw[];
}

/* ---------- Resultado ---------- */

export type Granularidade = "dia" | "semana" | "mes";

export interface Resumo {
  faturamento: number;
  faturamentoProdutos: number;
  taxasEntrega: number;
  pedidos: number;
  ticketMedio: number;
  itensVendidos: number;
  cancelados: number;
  /** Valor dos pedidos cancelados (o que deixou de entrar). */
  valorCancelado: number;
  /** Cancelados / (válidos + cancelados), de 0 a 1. */
  taxaCancelamento: number;
  clientesUnicos: number;
  /** Clientes com 2+ pedidos no período. */
  clientesRecorrentes: number;
  /** Fração dos pedidos que veio de clientes recorrentes, de 0 a 1. */
  pedidosDeRecorrentes: number;
  agendados: number;
  /** Média de pedidos por dia do período. */
  pedidosPorDia: number;
}

export interface Variacao {
  /** Variação relativa (0.12 = +12%). `null` se o anterior era zero. */
  faturamento: number | null;
  pedidos: number | null;
  ticketMedio: number | null;
}

export interface PontoSerie {
  /** Início do intervalo ("YYYY-MM-DD"). */
  chave: string;
  label: string;
  /** Nome completo do período, para o tooltip e a tabela (ex.: "27/11 (sexta)"). */
  detalhe: string;
  faturamento: number;
  pedidos: number;
}

export interface PratoVendido {
  produtoId: number;
  nome: string;
  categoria: string;
  quantidade: number;
  faturamento: number;
  /** Em quantos pedidos apareceu. */
  pedidos: number;
}

export interface CategoriaVendida {
  nome: string;
  quantidade: number;
  faturamento: number;
}

export interface DiaDaSemana {
  dia: number; // 1 = segunda … 7 = domingo
  label: string;
  pedidos: number;
  faturamento: number;
  /** Quantas vezes esse dia da semana aparece no período. */
  ocorrencias: number;
  mediaPedidos: number;
  mediaFaturamento: number;
}

export interface Hora {
  hora: number;
  label: string;
  pedidos: number;
  faturamento: number;
}

export interface Fatia {
  chave: string;
  label: string;
  pedidos: number;
  faturamento: number;
}

export interface Bairro {
  nome: string;
  pedidos: number;
  faturamento: number;
  taxas: number;
}

export interface Estatisticas {
  granularidade: Granularidade;
  resumo: Resumo;
  anterior: Resumo;
  variacao: Variacao;
  serie: PontoSerie[];
  pratos: PratoVendido[];
  categorias: CategoriaVendida[];
  diasSemana: DiaDaSemana[];
  horas: Hora[];
  pagamentos: Fatia[];
  tiposEntrega: Fatia[];
  bairros: Bairro[];
}

export interface OpcoesEstatisticas {
  /** Conta só pedidos com status Finalizado (4). Padrão: todos menos cancelados. */
  somenteFinalizados?: boolean;
}

/* ---------- Rótulos ---------- */

export const DIAS_SEMANA_LABEL = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MESES_LABEL = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const PAGAMENTO_LABEL: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

const TIPO_ENTREGA_LABEL: Record<string, string> = {
  delivery: "Entrega",
  takeaway: "Retirada",
};

const STATUS_CANCELADO = 0;
const STATUS_FINALIZADO = 4;

/* ---------- Helpers ---------- */

const dataDe = (p: StatsPedidoRaw) => p.data.slice(0, 10);

const noIntervalo = (data: string, { de, ate }: Intervalo) => data >= de && data <= ate;

const variacao = (atual: number, anterior: number): number | null =>
  anterior > 0 ? (atual - anterior) / anterior : null;

const ddmm = (data: string) => `${data.slice(8, 10)}/${data.slice(5, 7)}`;

/** Dia até ~2 meses; semana até ~6 meses; mês acima disso. */
export const escolherGranularidade = (intervalo: Intervalo): Granularidade => {
  const dias = diasNoIntervalo(intervalo);
  if (dias <= 62) return "dia";
  if (dias <= 190) return "semana";
  return "mes";
};

const chaveDoBalde = (data: string, g: Granularidade) =>
  g === "dia" ? data : g === "semana" ? inicioDaSemana(data) : `${data.slice(0, 7)}-01`;

const proximoBalde = (chave: string, g: Granularidade) => {
  if (g === "dia") return somarDias(chave, 1);
  if (g === "semana") return somarDias(chave, 7);
  const [a, m] = chave.split("-").map(Number);
  return m === 12 ? `${a + 1}-01-01` : `${a}-${String(m + 1).padStart(2, "0")}-01`;
};

const labelDoBalde = (chave: string, g: Granularidade) => {
  if (g === "dia") return ddmm(chave);
  if (g === "semana") return `sem. ${ddmm(chave)}`;
  return `${MESES_LABEL[Number(chave.slice(5, 7)) - 1]}/${chave.slice(2, 4)}`;
};

const DIAS_SEMANA_NOME = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

const detalheDoBalde = (chave: string, g: Granularidade) => {
  if (g === "dia") return `${ddmm(chave)} (${DIAS_SEMANA_NOME[diaSemanaIso(chave) - 1]})`;
  if (g === "semana") return `Semana de ${ddmm(chave)} a ${ddmm(somarDias(chave, 6))}`;
  return labelDoBalde(chave, g);
};

/** Quantas vezes cada dia da semana (1..7) aparece no intervalo. */
const contarDiasDaSemana = ({ de, ate }: Intervalo): number[] => {
  const contagem = Array(8).fill(0);
  for (let d = de; d <= ate; d = somarDias(d, 1)) contagem[diaSemanaIso(d)]++;
  return contagem;
};

const normalizarBairro = (bairro: string | null) => {
  const nome = (bairro ?? "").trim().replace(/\s+/g, " ");
  return nome || "Sem bairro";
};

/* ---------- Cálculo ---------- */

interface PedidoCalculado {
  raw: StatsPedidoRaw;
  data: string;
  subtotal: number;
  taxa: number;
  total: number;
  itens: { produto: number; qtd: number; total: number }[];
}

/** Preço de cada pedido com a regra do site. */
export const calcularPedidos = (raw: StatsRaw): PedidoCalculado[] => {
  const produtos = new Map(raw.produtos.map((p) => [p.id, p]));

  const atributosPorItem = new Map<number, StatsAtributoRaw[]>();
  for (const a of raw.atributos) {
    const lista = atributosPorItem.get(a.item) ?? [];
    lista.push(a);
    atributosPorItem.set(a.item, lista);
  }

  const itensPorPedido = new Map<number, PedidoCalculado["itens"]>();
  for (const item of raw.itens) {
    // Pedido novo: preço gravado na venda. Antigo: recalcula com o preço atual.
    const precoUnitario =
      item.precoUnitario != null
        ? item.precoUnitario
        : calcularPrecoUnitario(
            produtos.get(item.produto)?.preco ?? 0,
            (atributosPorItem.get(item.id) ?? []).map((a) => ({
              preco: a.preco,
              preco_incluido: a.incluido,
            })),
          );
    const lista = itensPorPedido.get(item.pedido) ?? [];
    lista.push({
      produto: item.produto,
      qtd: item.qtd,
      total: calcularTotalItem({ precoUnitario, quantidade: item.qtd }),
    });
    itensPorPedido.set(item.pedido, lista);
  }

  return raw.pedidos.map((p) => {
    const itens = itensPorPedido.get(p.id) ?? [];
    const subtotal = arredondar(itens.reduce((s, i) => s + i.total, 0));
    // Retirada não paga frete, mesmo que a taxa tenha ficado gravada
    const taxa = p.tipo === "delivery" ? arredondar(Number(p.taxa) || 0) : 0;
    return { raw: p, data: dataDe(p), subtotal, taxa, total: arredondar(subtotal + taxa), itens };
  });
};

const resumir = (
  validos: PedidoCalculado[],
  cancelados: PedidoCalculado[],
  intervalo: Intervalo,
): Resumo => {
  const soma = (lista: PedidoCalculado[], campo: "total" | "subtotal" | "taxa") =>
    arredondar(lista.reduce((s, p) => s + p[campo], 0));

  const porCliente = new Map<string, number>();
  for (const p of validos) {
    if (p.raw.cliente) porCliente.set(p.raw.cliente, (porCliente.get(p.raw.cliente) ?? 0) + 1);
  }
  const recorrentes = [...porCliente.values()].filter((n) => n >= 2);
  const pedidosRecorrentes = recorrentes.reduce((s, n) => s + n, 0);
  const comCliente = [...porCliente.values()].reduce((s, n) => s + n, 0);

  const faturamento = soma(validos, "total");
  const totalComCancelados = validos.length + cancelados.length;

  return {
    faturamento,
    faturamentoProdutos: soma(validos, "subtotal"),
    taxasEntrega: soma(validos, "taxa"),
    pedidos: validos.length,
    ticketMedio: validos.length ? arredondar(faturamento / validos.length) : 0,
    itensVendidos: validos.reduce((s, p) => s + p.itens.reduce((t, i) => t + i.qtd, 0), 0),
    cancelados: cancelados.length,
    valorCancelado: soma(cancelados, "total"),
    taxaCancelamento: totalComCancelados ? cancelados.length / totalComCancelados : 0,
    clientesUnicos: porCliente.size,
    clientesRecorrentes: recorrentes.length,
    pedidosDeRecorrentes: comCliente ? pedidosRecorrentes / comCliente : 0,
    agendados: validos.filter((p) => p.raw.entrega === "booking").length,
    pedidosPorDia: validos.length / diasNoIntervalo(intervalo),
  };
};

const fatias = (
  validos: PedidoCalculado[],
  chave: (p: PedidoCalculado) => string,
  labels: Record<string, string>,
): Fatia[] => {
  const mapa = new Map<string, Fatia>();
  for (const p of validos) {
    const k = chave(p) || "outro";
    const f = mapa.get(k) ?? { chave: k, label: labels[k] ?? k, pedidos: 0, faturamento: 0 };
    f.pedidos++;
    f.faturamento = arredondar(f.faturamento + p.total);
    mapa.set(k, f);
  }
  return [...mapa.values()].sort((a, b) => b.faturamento - a.faturamento);
};

export const calcularEstatisticas = (
  raw: StatsRaw,
  atual: Intervalo,
  anterior: Intervalo,
  { somenteFinalizados = false }: OpcoesEstatisticas = {},
): Estatisticas => {
  const todos = calcularPedidos(raw);
  const conta = (p: PedidoCalculado) =>
    somenteFinalizados
      ? p.raw.status === STATUS_FINALIZADO
      : p.raw.status !== STATUS_CANCELADO;

  const separar = (intervalo: Intervalo) => {
    const doPeriodo = todos.filter((p) => noIntervalo(p.data, intervalo));
    return {
      validos: doPeriodo.filter(conta),
      cancelados: doPeriodo.filter((p) => p.raw.status === STATUS_CANCELADO),
    };
  };

  const a = separar(atual);
  const b = separar(anterior);
  const resumo = resumir(a.validos, a.cancelados, atual);
  const resumoAnterior = resumir(b.validos, b.cancelados, anterior);
  const validos = a.validos;

  // Série temporal com todos os intervalos (inclusive os sem pedido)
  const granularidade = escolherGranularidade(atual);
  const baldes = new Map<string, PontoSerie>();
  for (
    let chave = chaveDoBalde(atual.de, granularidade);
    chave <= atual.ate;
    chave = proximoBalde(chave, granularidade)
  ) {
    baldes.set(chave, { chave, label: labelDoBalde(chave, granularidade), detalhe: detalheDoBalde(chave, granularidade), faturamento: 0, pedidos: 0 });
  }
  for (const p of validos) {
    const ponto = baldes.get(chaveDoBalde(p.data, granularidade));
    if (ponto) {
      ponto.pedidos++;
      ponto.faturamento = arredondar(ponto.faturamento + p.total);
    }
  }

  // Pratos e categorias
  const produtos = new Map(raw.produtos.map((p) => [p.id, p]));
  const categorias = new Map(raw.categorias.map((c) => [c.id, c.nome]));
  const pratos = new Map<number, PratoVendido & { _pedidos: Set<number> }>();
  for (const p of validos) {
    for (const item of p.itens) {
      const produto = produtos.get(item.produto);
      const prato =
        pratos.get(item.produto) ??
        {
          produtoId: item.produto,
          nome: produto?.nome ?? `Produto #${item.produto} (removido)`,
          categoria:
            (produto?.categoria != null && categorias.get(produto.categoria)) || "Sem categoria",
          quantidade: 0,
          faturamento: 0,
          pedidos: 0,
          _pedidos: new Set<number>(),
        };
      prato.quantidade += item.qtd;
      prato.faturamento = arredondar(prato.faturamento + item.total);
      prato._pedidos.add(p.raw.id);
      pratos.set(item.produto, prato);
    }
  }
  const listaPratos: PratoVendido[] = [...pratos.values()]
    .map(({ _pedidos, ...prato }) => ({ ...prato, pedidos: _pedidos.size }))
    .sort((x, y) => y.quantidade - x.quantidade || y.faturamento - x.faturamento);

  const porCategoria = new Map<string, CategoriaVendida>();
  for (const prato of listaPratos) {
    const c = porCategoria.get(prato.categoria) ?? { nome: prato.categoria, quantidade: 0, faturamento: 0 };
    c.quantidade += prato.quantidade;
    c.faturamento = arredondar(c.faturamento + prato.faturamento);
    porCategoria.set(prato.categoria, c);
  }

  // Dias da semana (total e média por ocorrência do dia)
  const ocorrencias = contarDiasDaSemana(atual);
  const diasSemana: DiaDaSemana[] = DIAS_SEMANA_LABEL.map((label, i) => ({
    dia: i + 1,
    label,
    pedidos: 0,
    faturamento: 0,
    ocorrencias: ocorrencias[i + 1],
    mediaPedidos: 0,
    mediaFaturamento: 0,
  }));
  const horas: Hora[] = Array.from({ length: 24 }, (_, h) => ({
    hora: h,
    label: `${String(h).padStart(2, "0")}h`,
    pedidos: 0,
    faturamento: 0,
  }));
  for (const p of validos) {
    const dia = diasSemana[diaSemanaIso(p.data) - 1];
    dia.pedidos++;
    dia.faturamento = arredondar(dia.faturamento + p.total);
    const hora = horas[Number(p.raw.data.slice(11, 13))];
    if (hora) {
      hora.pedidos++;
      hora.faturamento = arredondar(hora.faturamento + p.total);
    }
  }
  for (const d of diasSemana) {
    d.mediaPedidos = d.ocorrencias ? d.pedidos / d.ocorrencias : 0;
    d.mediaFaturamento = d.ocorrencias ? arredondar(d.faturamento / d.ocorrencias) : 0;
  }

  // Bairros (só entregas)
  const bairros = new Map<string, Bairro>();
  for (const p of validos) {
    if (p.raw.tipo !== "delivery") continue;
    const nome = normalizarBairro(p.raw.bairro);
    const chave = nome.toLocaleLowerCase("pt-BR");
    const b = bairros.get(chave) ?? { nome, pedidos: 0, faturamento: 0, taxas: 0 };
    b.pedidos++;
    b.faturamento = arredondar(b.faturamento + p.total);
    b.taxas = arredondar(b.taxas + p.taxa);
    bairros.set(chave, b);
  }

  return {
    granularidade,
    resumo,
    anterior: resumoAnterior,
    variacao: {
      faturamento: variacao(resumo.faturamento, resumoAnterior.faturamento),
      pedidos: variacao(resumo.pedidos, resumoAnterior.pedidos),
      ticketMedio: variacao(resumo.ticketMedio, resumoAnterior.ticketMedio),
    },
    serie: [...baldes.values()],
    pratos: listaPratos,
    categorias: [...porCategoria.values()].sort((x, y) => y.faturamento - x.faturamento),
    diasSemana,
    // Só a faixa de horas em que a loja teve movimento
    horas: (() => {
      const comPedido = horas.filter((h) => h.pedidos > 0);
      if (!comPedido.length) return [];
      const min = comPedido[0].hora;
      const max = comPedido[comPedido.length - 1].hora;
      return horas.slice(min, max + 1);
    })(),
    pagamentos: fatias(validos, (p) => p.raw.pagamento, PAGAMENTO_LABEL),
    tiposEntrega: fatias(validos, (p) => p.raw.tipo, TIPO_ENTREGA_LABEL),
    bairros: [...bairros.values()].sort((x, y) => y.pedidos - x.pedidos || y.faturamento - x.faturamento),
  };
};
