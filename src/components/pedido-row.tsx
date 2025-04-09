import React from 'react'
import { StatusColor } from './status-color'
import { DetailPedidos } from './detail-pedidos'
import { useRouter } from 'next/navigation'
import { IPedidosData } from '@/interfaces/IPedidosData'

export const PedidoRow = ({ pedido }: IPedidosData) => {
    const router = useRouter();
    const handleGoToPedido = (id: string) => {
        router.push(`/admin/pedido/${id}`);
    }

    return (
        <button onClick={() => { handleGoToPedido(pedido.id) }} className='cursor-pointer w-full text-left bg-zinc-100 border border-zinc-200 gap-3 my-2 py-2.5 px-3.5 rounded-md flex justify-between items-center relative'>
            <DetailPedidos status={pedido.status} />
            <div>
                <div className='flex items-center gap-2'>
                    <strong>Pedido: {pedido.id}</strong>
                    <div className='h-0.5 w-3 rounded-md bg-purple-principal-900'></div>
                    {pedido.created_at}
                </div>
                <p>{pedido.client_name}</p>
                <p>{pedido.client_phone}</p>
            </div>
            <StatusColor status={pedido.status} />
        </button>
    )
}