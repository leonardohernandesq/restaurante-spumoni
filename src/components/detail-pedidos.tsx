import React from 'react'

export const DetailPedidos = ({ status }: { status: string }) => {
    const statusColors: { [key: string]: string } = {
        'confirmado': 'bg-green-principal-700',
        'cancelado': 'bg-red-700',
        'novo pedido': 'bg-yellow-700',
        'preparando': 'bg-blue-700',
        'saindo para entrega': 'bg-purple-700',
    };

    const color = statusColors[status.toLowerCase()] || 'bg-gray-400';

    return (
        <div className={`w-1 h-full flex absolute top-0 left-0 rounded-sm ${color}`}></div>
    )
}
