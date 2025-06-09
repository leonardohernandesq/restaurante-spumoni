import { IPedido } from "@/interfaces/IPedidosData";

export const CheckoutClientData = ({ pedido }: { pedido: IPedido | null }) => (
    <div className='flex flex-col px-4 py-2'>
        <h2 className='font-bold text-purple-principal-700 text-lg'>Dados do cliente</h2>
        <p><strong>Nome do Cliente:</strong> {pedido?.nome_cliente}</p>
        <p><strong>Telefone do Cliente:</strong> {pedido?.telefone}</p>
    </div>
);
