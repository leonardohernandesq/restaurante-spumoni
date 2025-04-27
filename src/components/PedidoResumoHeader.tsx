import Image from 'next/image'
import { IPedidoResumoHeaderProps } from '@/interfaces/IPedidoResumoHeaderProps'

export const PedidoResumoHeader = ({ produtos }: IPedidoResumoHeaderProps) => {
    return (
        <section className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
                <p className="font-light">SEU PEDIDO</p>
                <p className="font-medium">{produtos.length === 1 ? '1 Item' : `${produtos.length} Itens`}</p>
            </div>
            <div className="flex opacity-75">
                {produtos.map((produto) => (
                    <Image
                        key={produto.id}
                        className="shadow rounded-full ml-[-10px]"
                        src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${produto.imagem}`}
                        alt={produto.nome}
                        width={40}
                        height={40}
                    />
                ))}
            </div>
        </section>
    )
}

export default PedidoResumoHeader
