export interface IPedidoCreate {
    nome_cliente: string;
    telefone: string;
    tipo_entrega: 'delivery' | 'takeaway';
    entrega: 'booking' | 'now';
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
