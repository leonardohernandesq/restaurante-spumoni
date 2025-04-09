export const StatusColor = ({ status }: { status: string }) => {
    const statusColors: { [key: string]: string } = {
        'confirmado': 'bg-green-principal-700',
        'cancelado': 'bg-red-700',
        'novo pedido': 'bg-yellow-700',
        'preparando': 'bg-blue-700',
        'saindo para entrega': 'bg-purple-700',
    };

    const color = statusColors[status.toLowerCase()] || 'bg-gray-400';



    return (
        <div className={`${color} text-white py-1 px-2 rounded-md text-sm text-center`}>{status}</div>
    )
}

