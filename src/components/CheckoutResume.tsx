import { IPedidoCompleto } from '@/interfaces/IPedidosData'

export const CheckoutResume = ({ pedido }: { pedido: IPedidoCompleto | null }) => {
    return (
        <section className='w-full rounded-lg'>
            <div className='flex flex-col px-4 py-2'>
                <h2 className='font-bold text-purple-principal-700 text-lg'>Dados do cliente</h2>
                <p><strong>Nome do Cliente:</strong> {pedido?.nome_cliente}</p>
                <p><strong>Telefone do Cliente:</strong> {pedido?.telefone}</p>
            </div>
            <div className='flex flex-col border-t border-zinc-300 px-4 pt-2'>
                <h2 className='font-bold text-purple-principal-700 text-lg'>Dados de {pedido?.tipo_entrega === 'delivery' ? 'entrega:' : 'retirada:'} </h2>
                <p><strong>Tipo de {pedido?.tipo_entrega === 'delivery' ? 'entrega:' : 'retirada:'}</strong> {pedido?.entrega === 'now' ? 'Para agora' : 'Agendada'}</p>
                <p>{pedido?.data_entrega && new Date(pedido.data_entrega).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
                </p>
            </div>
            {pedido?.tipo_entrega === 'delivery' &&
                <>
                    <div className='flex flex-col px-4 pb-2'>
                        <p><strong>Endereço de Entrega:</strong> {pedido?.endereco_entrega}, {pedido?.numero} {pedido?.complemento} - {pedido?.bairro} CEP: {pedido?.cep} - {pedido?.distancia}km. {pedido?.referencia}</p>
                        <p><strong>Taxa de Entrega:</strong> R${pedido?.taxa_entrega}</p>
                    </div>
                </>
            }
            {pedido?.tipo_entrega === 'takeaway' &&
                <>
                    <div className='flex flex-col px-4 pb-2'>
                        <p>Estrada da Giesteira 65/67, Arruda dos Vinhos, 2630-241, Portugal</p>
                    </div>
                </>
            }
            <div className='flex flex-col border-t border-zinc-300 px-4 py-2'>
                <h2 className='font-bold text-purple-principal-700 text-lg'>Dados de pagamento</h2>
                <p><strong>Pagamento:</strong> {pedido?.forma_pagamento}</p>
                {pedido?.troco && (
                    <p><strong>Precisa de troco?</strong> {pedido.troco}</p>
                )}

                {pedido?.nota_fiscal && (
                    <p><strong>NF:</strong> {pedido.nota_fiscal}</p>
                )}

            </div>
            <div className='flex flex-col border-t border-zinc-300 px-4 py-2'>
                <h2 className='font-bold text-purple-principal-700 text-lg'>Produtos</h2>

                {pedido?.produtos?.map((produto, index) => (
                    <div key={produto.id} className='p-1'>
                        <p className='font-bold'>
                            {produto.quantidade}x - {produto.produto_nome}
                        </p>
                        {produto.atributos?.length > 0 && (
                            <div className='ml-4 mt-1 mb-2 text-sm text-zinc-700'>
                                {produto.atributos.map((attr) => (
                                    <p key={attr.id}>
                                        • <strong>{attr.nome_atributo}:</strong> {attr.valor}
                                    </p>
                                ))}
                            </div>
                        )}
                        {index >= 1 && <hr />}
                    </div>
                ))}
            </div>

            <div className='flex flex-col border-t border-zinc-300 px-4 py-2'>
                <h2 className='font-bold text-purple-principal-700 text-lg'>Detalhes do pedido</h2>
                <p className='px-1 text-sm'><strong>Valor produtos:</strong> R${pedido?.total_produtos}</p>
                <p className='px-1 text-sm'><strong>Valor entrega:</strong> R${pedido?.taxa_entrega}</p>
                <p className='px-1 text-lg font-bold text-green-principal-700'><strong>Valor total:</strong> R${pedido?.valor_total}</p>
            </div>
        </section>
    )
}