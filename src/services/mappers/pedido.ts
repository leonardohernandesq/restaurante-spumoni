import { isPrecoIncluido, toNumber } from "@/domain/pricing";
import type {
  Pedido,
  PedidoApi,
  PedidoAtributo,
  PedidoAtributoApi,
  PedidoItem,
  PedidoItemApi,
} from "@/types/pedido";

const texto = (valor: string | null | undefined): string | undefined =>
  valor === null || valor === undefined || valor === "" ? undefined : valor;

const numeroOpcional = (
  valor: number | string | null | undefined,
): number | undefined =>
  valor === null || valor === undefined || valor === ""
    ? undefined
    : toNumber(valor);

export const mapPedidoAtributoApi = (
  attr: PedidoAtributoApi,
): PedidoAtributo => ({
  id: toNumber(attr.id),
  pedido_item_id: toNumber(attr.pedido_item_id),
  atributo_id: toNumber(attr.atributo_id),
  valor_atributo_id: toNumber(attr.valor_atributo_id),
  nome_atributo: attr.nome_atributo,
  valor: attr.valor,
  preco: toNumber(attr.preco),
  preco_incluido: isPrecoIncluido(attr.preco_incluido),
});

export const mapPedidoItemApi = (item: PedidoItemApi): PedidoItem => ({
  id: toNumber(item.id),
  pedido_id: toNumber(item.pedido_id),
  produto_id: toNumber(item.produto_id),
  quantidade: toNumber(item.quantidade),
  observacao: item.observacao ?? "",
  produto_nome: item.produto_nome,
  preco_base: toNumber(item.preco_base),
  atributos: (item.atributos ?? []).map(mapPedidoAtributoApi),
});

/** Converte o pedido cru da API para o formato do app. */
export const mapPedidoApi = (api: PedidoApi): Pedido => ({
  id: toNumber(api.id ?? api.pedido_id),
  nome_cliente: api.nome_cliente,
  telefone: api.telefone,
  tipo_entrega: api.tipo_entrega,
  entrega: api.entrega,
  data_entrega: texto(api.data_entrega),
  endereco_entrega: texto(api.endereco_entrega),
  bairro: texto(api.bairro),
  cep: texto(api.cep),
  numero: texto(api.numero),
  complemento: texto(api.complemento),
  referencia: texto(api.referencia),
  distancia: numeroOpcional(api.distancia),
  taxa_entrega: toNumber(api.taxa_entrega),
  total_produtos: toNumber(api.total_produtos),
  valor_total: toNumber(api.valor_total),
  status: toNumber(api.status),
  forma_pagamento: api.forma_pagamento,
  troco: numeroOpcional(api.troco),
  nota_fiscal: texto(api.nota_fiscal),
  data_pedido: api.data_pedido,
  produtos: (api.produtos ?? []).map(mapPedidoItemApi),
  excluido:
    typeof api.excluido === "boolean" ? api.excluido : toNumber(api.excluido ?? 0) === 1,
  excluido_em: texto(api.excluido_em),
});
