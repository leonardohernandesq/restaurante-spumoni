import { useRouter } from 'next/navigation'

import { IPedidosData } from '@/interfaces/IPedidosData'

import { StatusColor } from '@/components/StatusColor'
import { DetailPedidos } from '@/components/DetailPedidos'

export const PedidoRow = ({ pedido }: IPedidosData) => {
    const router = useRouter();
    const handleGoToPedido = (id: string) => {
        router.push(`/admin/pedido/${id}`);
    }

    return (
        <button onClick={() => pedido.id && handleGoToPedido(pedido.id)} className='cursor-pointer w-full text-left bg-zinc-100 border border-zinc-200 gap-3 my-2 py-2.5 px-3.5 rounded-md flex justify-between items-center relative'>
            <DetailPedidos status={pedido.status ?? 0} />
            <div>
                <div className='flex items-center gap-2'>
                    <strong>Pedido: {pedido.id}</strong>
                    <div className='h-0.5 w-3 rounded-md bg-purple-principal-900'></div>
                    {pedido.data_pedido && (
                        <span>
                            {new Date(pedido.data_pedido).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    )}

                </div>
                <p>{pedido.nome_cliente}</p>
                <p>{pedido.telefone}</p>
            </div>
            <StatusColor status={pedido.status || 0} />
        </button>
    )
}