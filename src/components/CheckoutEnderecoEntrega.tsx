import { IPedido } from "@/interfaces/IPedidosData";

export const CheckoutEnderecoEntrega = ({ pedido }: { pedido: IPedido | null }) => {
    if (pedido?.tipo_entrega === 'delivery') {
        return (
            <div className='flex flex-col px-4 pb-2'>
                <p>
                    <strong>Endereço de Entrega:</strong> {pedido?.endereco_entrega}, {pedido?.numero} {pedido?.complemento} - {pedido?.bairro} CEP: {pedido?.cep} - {pedido?.distancia}km. {pedido?.referencia}
                </p>
                <p><strong>Taxa de Entrega:</strong> R${pedido?.taxa_entrega}</p>
            </div>
        );
    }

    if (pedido?.tipo_entrega === 'takeaway') {
        return (
            <div className='flex flex-col px-4 pb-2'>
                <p>Estrada da Giesteira 65/67, Arruda dos Vinhos, 2630-241, Portugal</p>
            </div>
        );
    }

    return null;
};
