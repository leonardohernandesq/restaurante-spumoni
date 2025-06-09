import { IPedido } from "@/interfaces/IPedidosData";
import { CheckoutProdutoItem } from "./CheckoutProdutoItem";

export const CheckoutProductList = ({ pedido }: { pedido: IPedido | null }) => (
    <div className='flex flex-col border-t border-zinc-300 px-4 py-2'>
        <h2 className='font-bold text-purple-principal-700 text-lg'>Produtos</h2>
        {pedido?.produtos?.map((produto, index) => (
            <CheckoutProdutoItem key={produto.id} produto={produto} isNotFirst={index >= 1} />
        ))}
    </div>
);
