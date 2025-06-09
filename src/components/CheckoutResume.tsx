import { IPedido } from "@/interfaces/IPedidosData";
import { CheckoutClientData } from "./CheckoutClientData";
import { CheckoutEntregaData } from "./CheckoutEntregaData";
import { CheckoutPagamentoData } from "./CheckoutPagamentoData";
import { CheckoutEnderecoEntrega } from "./CheckoutEnderecoEntrega";
import { CheckoutProductList } from "./CheckoutProductList";
import { CheckoutResumoPedido } from "./CheckoutResumoPedido";

export const CheckoutResume = ({ pedido }: { pedido: IPedido | null }) => {
    return (
        <section className='w-full rounded-lg'>
            <CheckoutClientData pedido={pedido} />
            <CheckoutEntregaData pedido={pedido} />
            <CheckoutEnderecoEntrega pedido={pedido} />
            <CheckoutPagamentoData pedido={pedido} />
            <CheckoutProductList pedido={pedido} />
            <CheckoutResumoPedido pedido={pedido} />
        </section>
    );
};
