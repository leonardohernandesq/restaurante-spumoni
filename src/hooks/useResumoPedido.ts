import { useMemo } from 'react'

export const useResumoPedido = (
    produtos: { preco: number; quantidade: number }[],
    distancia: number | null,
    delivery: 'delivery' | 'takeaway'
) => {
    const invalidDelivery = useMemo(() => {
        return distancia !== null && distancia > 10
    }, [distancia])

    const taxaEntrega = useMemo(() => {
        if (delivery === 'takeaway') return 0

        if (distancia === null) return 0
        if (distancia <= 3) return 2.99
        if (distancia <= 6) return 4.99
        if (distancia <= 10) return 7.99

        return 0
    }, [distancia, delivery])

    const subtotal = useMemo(() => {
        return produtos.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2)
    }, [produtos])

    const valorFinal = useMemo(() => {
        return (parseFloat(subtotal) + taxaEntrega).toFixed(2)
    }, [subtotal, taxaEntrega])

    return { subtotal, taxaEntrega, valorFinal, invalidDelivery }
}
