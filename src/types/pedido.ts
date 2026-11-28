/**
 * Tipos de pedido.
 *
 * - `PedidoApi`: formato cru que a API devolve (números e 0/1 chegam como string).
 * - `Pedido`: formato usado no app, já normalizado pelo mapper em
 *   `services/mappers/pedido.ts`. Componentes nunca precisam de `Number(...)`.
 * - `PedidoCreateDto`: corpo enviado para criar um pedido.
 */

export type TipoEntrega = "delivery" | "takeaway";
export type MomentoEntrega = "booking" | "now";

type Numerico = number | string;

/* ---------- Formato da API ---------- */

export interface PedidoAtributoApi {
  id: Numerico;
  pedido_item_id: Numerico;
  atributo_id: Numerico;
  valor_atributo_id: Numerico;
  nome_atributo: string;
  valor: string;
  preco: Numerico;
  preco_incluido: Numerico | boolean;
}

export interface PedidoItemApi {
  id: Numerico;
  pedido_id: Numerico;
  produto_id: Numerico;
  quantidade: Numerico;
  observacao: string | null;
  produto_nome: string;
  preco_base: Numerico;
  atributos?: PedidoAtributoApi[] | null;
}

export interface PedidoApi {
  id: Numerico;
  pedido_id?: Numerico;
  nome_cliente: string;
  telefone: string;
  tipo_entrega: TipoEntrega;
  entrega: MomentoEntrega;
  data_entrega?: string | null;
  endereco_entrega?: string | null;
  bairro?: string | null;
  cep?: string | null;
  numero?: string | null;
  complemento?: string | null;
  referencia?: string | null;
  distancia?: Numerico | null;
  taxa_entrega?: Numerico | null;
  total_produtos?: Numerico | null;
  valor_total?: Numerico | null;
  status: Numerico;
  forma_pagamento: string;
  troco?: Numerico | null;
  nota_fiscal?: string | null;
  data_pedido: string;
  produtos?: PedidoItemApi[] | null;
  /** Pedido marcado como excluído (0/1). Ausente em respostas antigas. */
  excluido?: Numerico | boolean | null;
  excluido_em?: string | null;
}

/* ---------- Formato do app ---------- */

export interface PedidoAtributo {
  id: number;
  pedido_item_id: number;
  atributo_id: number;
  valor_atributo_id: number;
  nome_atributo: string;
  valor: string;
  preco: number;
  preco_incluido: boolean;
}

export interface PedidoItem {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  observacao: string;
  produto_nome: string;
  /** Preço base do produto na venda (B8). Pedidos antigos: preço atual do produto. */
  preco_base: number;
  atributos: PedidoAtributo[];
}

export interface Pedido {
  id: number;
  nome_cliente: string;
  telefone: string;
  tipo_entrega: TipoEntrega;
  entrega: MomentoEntrega;
  /** Hora de parede de São Paulo ("YYYY-MM-DDTHH:MM"). */
  data_entrega?: string;
  endereco_entrega?: string;
  bairro?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  referencia?: string;
  distancia?: number;
  taxa_entrega: number;
  /** Valor salvo pelo backend (ver B7: ignora o preço base). */
  total_produtos: number;
  /** Valor salvo pelo backend (ver B7). */
  valor_total: number;
  status: number;
  forma_pagamento: string;
  troco?: number;
  nota_fiscal?: string;
  /** Hora de parede de São Paulo ("YYYY-MM-DD HH:MM:SS"). */
  data_pedido: string;
  produtos: PedidoItem[];
  /**
   * Excluído pelo admin: não conta em nenhum lugar (estatísticas etc.) e
   * fica no fim da lista de pedidos. O status original é mantido.
   */
  excluido: boolean;
  /** Quando foi excluído (hora de São Paulo). */
  excluido_em?: string;
}

/* ---------- Envio ---------- */

export interface PedidoCreateDto {
  nome_cliente: string;
  telefone: string;
  tipo_entrega: TipoEntrega;
  entrega: MomentoEntrega;
  data_entrega?: string;
  forma_pagamento: string;
  troco?: string;
  nota_fiscal?: string;
  data_pedido: string;
  produtos: {
    produto_id: number;
    quantidade: number;
    observacao: string;
    atributos: {
      atributo_id: number | null;
      valor_atributo_id: number | null;
      preco_incluido?: boolean;
    }[];
  }[];
  distancia?: number;
  taxa_entrega?: number;
  endereco_entrega?: string;
  bairro?: string;
  numero?: string;
  complemento?: string;
  cep?: string;
  referencia?: string;
}

/* ---------- Lista paginada (GET /orders?paginado=1) ---------- */

export interface PaginacaoMeta {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
}

/** Filtros da lista de pedidos, aplicados no servidor. */
export interface PedidosFiltro {
  page: number;
  perPage: number;
  /** Status marcados (sem os excluídos). Vazio e `excluidos` falso = todos. */
  status: number[];
  /** Mostra os excluídos (sozinhos ou junto dos status marcados). */
  excluidos: boolean;
  /** Nome, telefone ou número do pedido. */
  busca: string;
}

/** Quantos pedidos cada filtro traria (já com a busca aplicada). */
export interface PedidosContagem {
  /** Por status, sem os excluídos. */
  status: Record<number, number>;
  excluidos: number;
}

export interface PedidosPaginaApi {
  data: PedidoApi[];
  pagination: PaginacaoMeta;
  /** O PHP devolve `status` como lista [n0, n1, ...] ou objeto {"0": n0, ...}. */
  contagem?: { status: number[] | Record<string, number>; excluidos: number };
}

export interface PedidosPagina {
  data: Pedido[];
  pagination: PaginacaoMeta;
  contagem?: PedidosContagem;
}
