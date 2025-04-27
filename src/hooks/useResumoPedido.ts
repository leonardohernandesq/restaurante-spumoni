import { useMemo } from 'react'

export const useResumoPedido = (produtos: { preco: number; quantidade: number }[], taxaEntrega: number = 5.99) => {
    const subtotal = useMemo(() => {
        return produtos.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2)
    }, [produtos])

    const valorFinal = useMemo(() => {
        return (parseFloat(subtotal) + taxaEntrega).toFixed(2)
    }, [subtotal, taxaEntrega])

    return { subtotal, taxaEntrega, valorFinal }
}
