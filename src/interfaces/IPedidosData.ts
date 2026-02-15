export interface IPedidosData {
  pedido: IPedido;
}

export interface IPedido {
  id?: number;
  pedido_id?: number;
  nome_cliente: string;
  telefone: string;
  tipo_entrega: "delivery" | "takeaway";
  entrega: "booking" | "now";
  data_entrega?: string;
  endereco_entrega?: string;
  bairro?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  referencia?: string;
  distancia?: string | number;
  taxa_entrega: string;
  total_produtos: string;
  valor_total: string;
  status: number;
  forma_pagamento: string;
  troco?: string;
  nota_fiscal?: string;
  data_pedido: string;

  produtos: {
    id: number;
    pedido_id: number;
    produto_id: number;
    quantidade: number;
    observacao: string;
    produto_nome: string;
    preco_base: string;
    atributos: {
      id: number;
      pedido_item_id: number;
      atributo_id: number;
      valor_atributo_id: number;
      nome_atributo: string;
      valor: string;
      preco: string;
      preco_incluido: number;
    }[];
  }[];
}
