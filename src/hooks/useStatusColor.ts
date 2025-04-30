import { useMemo } from 'react';

interface StatusInfo {
    label: string;
    color: string;
}

export type StatusKey = 0 | 1 | 2 | 3 | 4;

export function useStatusColor() {
    const statusMap = useMemo<Record<StatusKey, StatusInfo>>(() => ({
        0: { label: 'Cancelado', color: 'bg-red-700' },
        1: { label: 'Novo pedido', color: 'bg-yellow-600' },
        2: { label: 'Preparando', color: 'bg-blue-700' },
        3: { label: 'Saindo para entrega', color: 'bg-purple-700' },
        4: { label: 'Confirmado', color: 'bg-green-700' },
    }), []);

    const statusOptions = useMemo(
        () =>
            (Object.entries(statusMap) as [string, StatusInfo][])
                .map(([key, { label }]) => ({
                    id: Number(key) as StatusKey,
                    label,
                })),
        [statusMap]
    );

    const getLabel = (status: number): string =>
        statusMap[status as StatusKey]?.label ?? 'Desconhecido';

    const getColor = (status: number): string =>
        statusMap[status as StatusKey]?.color ?? 'bg-gray-400';

    return {
        statusMap,
        statusOptions,
        getLabel,
        getColor,
    };
}
