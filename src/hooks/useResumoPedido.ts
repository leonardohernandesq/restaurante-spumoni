import { useMemo } from 'react'

type ProdutoCarrinho = {
    preco?: number
    quantidade: number
    atributos: {
        preco: number
        preco_incluido?: boolean
    }[]
}

export const useResumoPedido = (
    produtos: ProdutoCarrinho[],
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

    const calcularPrecoProduto = (produto: ProdutoCarrinho) => {
        let precoBase = 0;

        for (const attr of produto.atributos || []) {
            if (attr.preco_incluido) {
                precoBase = attr.preco;
            } else {
                precoBase += attr.preco;
            }
        }

        return precoBase * produto.quantidade;
    };


    const subtotal = useMemo(() => {
        return produtos
            .reduce((acc, produto) => acc + calcularPrecoProduto(produto), 0)
            .toFixed(2);
    }, [produtos])

    const valorFinal = useMemo(() => {
        return (parseFloat(subtotal) + taxaEntrega).toFixed(2)
    }, [subtotal, taxaEntrega])

    return { subtotal, taxaEntrega, valorFinal, invalidDelivery }
}
