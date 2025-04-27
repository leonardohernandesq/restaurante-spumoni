'use client'

interface ResumoPedidoProps {
    produtosLength: number
    subtotal: string
    taxaEntrega: number
    valorFinal: string
}

export const ResumoPedido = ({ produtosLength, subtotal, taxaEntrega, valorFinal }: ResumoPedidoProps) => {
    return (
        <section className="text-zinc-700">
            <p className="text-sm">RESUMO</p>
            <div className="flex justify-between items-center my-2 text-sm">
                <p>{produtosLength === 1 ? '1 Item' : `${produtosLength} Itens`}</p>
                <p>R$ {subtotal}</p>
            </div>
            <div className="flex justify-between items-center my-2 text-sm">
                <p>Entrega</p>
                <p>R$ {taxaEntrega}</p>
            </div>
            <div className="flex justify-between items-center my-2 text-sm">
                <p>Total</p>
                <p>R$ {valorFinal}</p>
            </div>
        </section>
    )
}

export default ResumoPedido
