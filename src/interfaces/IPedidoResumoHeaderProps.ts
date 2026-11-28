export interface IPedidoResumoHeaderProps {
    produtos: {
        /** Único por variação no carrinho (o mesmo produto pode aparecer 2x). */
        itemId: string
        imagem: string
        nome: string
    }[]
}
