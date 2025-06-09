import { IPedido } from "@/interfaces/IPedidosData";

export const CheckoutPagamentoData = ({ pedido }: { pedido: IPedido | null }) => (
    <div className='flex flex-col border-t border-zinc-300 px-4 py-2'>
        <h2 className='font-bold text-purple-principal-700 text-lg'>Dados de pagamento</h2>
        <p><strong>Pagamento:</strong> {pedido?.forma_pagamento}</p>
        {pedido?.troco && <p><strong>Precisa de troco?</strong> {pedido.troco}</p>}
        {pedido?.nota_fiscal && <p><strong>NF:</strong> {pedido.nota_fiscal}</p>}
    </div>
);
