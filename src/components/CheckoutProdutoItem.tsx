import { IPedido } from "@/interfaces/IPedidosData";

export const CheckoutProdutoItem = ({ produto, isNotFirst }: { produto: IPedido['produtos'][0]; isNotFirst: boolean }) => (
    <div>
        {isNotFirst && <hr />}
        <div className='p-1'>
            <p className='font-bold'>
                {produto.quantidade}x - {produto.produto_nome}
            </p>
            {produto.atributos?.length > 0 && (
                <div className='ml-4 mt-1 mb-2 text-sm text-zinc-700'>
                    {produto.atributos.map(attr => (
                        <p key={attr.id}>
                            • <strong>{attr.nome_atributo}:</strong> {attr.valor}
                        </p>
                    ))}
                </div>
            )}
        </div>
    </div>
);
