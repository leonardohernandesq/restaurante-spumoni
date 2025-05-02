export interface IPedido {
    id?: string;
    pedido_id?: number;
    nome_cliente: string;
    telefone: number | string;
    status?: number;
    tipo_entrega: 'delivery' | 'takeaway';
    entrega: 'booking' | 'now';
    data_entrega?: Date | string;
    distancia?: string | number;
    taxa_entrega?: string | number;
    endereco_entrega?: string;
    bairro?: string;
    numero?: number | string;
    complemento?: string | number;
    cep?: string;
    referencia?: string;
    forma_pagamento: string;
    troco?: number | string;
    total_produtos?: number | string;
    valor_total?: number | string;
    nota_fiscal?: string;
    data_pedido: Date | string;
    produtos?: {
        produto_id: number;
        quantidade: number;
        observacao: string;
        atributos: {
            atributo_id: number;
            valor_atributo_id: number;
        }[];
    }[];
}

export interface IPedidosData {
    pedido: IPedido;
}

export interface IPedidoCompleto {
    id: number;
    nome_cliente: string;
    telefone: string;
    tipo_entrega: 'delivery' | 'takeaway';
    entrega: 'booking' | 'now';
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
