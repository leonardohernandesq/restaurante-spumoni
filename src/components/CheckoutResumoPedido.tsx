import { IPedido } from "@/interfaces/IPedidosData";

export const CheckoutResumoPedido = ({ pedido }: { pedido: IPedido | null }) => (
    <div className='flex flex-col border-t border-zinc-300 px-4 py-2'>
        <h2 className='font-bold text-purple-principal-700 text-lg'>Detalhes do pedido</h2>
        <p className='px-1 text-sm'><strong>Valor produtos:</strong> R${pedido?.total_produtos}</p>
        <p className='px-1 text-sm'><strong>Valor entrega:</strong> R${pedido?.taxa_entrega}</p>
        <p className='px-1 text-lg font-bold text-green-principal-700'><strong>Valor total:</strong> R${pedido?.valor_total}</p>
    </div>
);
