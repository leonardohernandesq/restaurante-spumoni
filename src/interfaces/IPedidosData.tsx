export interface IPedido {
    id?: string;
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
