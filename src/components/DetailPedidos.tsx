import { useStatusColor } from '@/hooks/useStatusColor';

export const DetailPedidos = ({ status }: { status: number }) => {
    const { getColor } = useStatusColor();
    const color = getColor(status);

    return (
        <div className={`w-1 h-full flex absolute top-0 left-0 rounded-sm ${color}`}></div>
    )
}
