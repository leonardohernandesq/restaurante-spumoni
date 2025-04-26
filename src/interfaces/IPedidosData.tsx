export interface IPedido {
    id: string;
    client_name: string;
    client_phone: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface IPedidosData {
    pedido: IPedido;
}
