'use client'

import { HeaderPages } from '@/components/header-pages'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiPencil, BiPlus, BiTrash } from 'react-icons/bi'

const Carrinho = () => {
    const [quantidade, setQuantidade] = useState(1);
    const router = useRouter();

    const handleFinish = () => {
        router.push('/obrigado')
    }

    return (
        <>
            <HeaderPages title='Fazer pedido' />
            <main className='relative max-w-full px-7 py-5 gap-4 flex flex-col md:max-w-7xl md:m-auto bg-zinc-100 flex-1 h-screen'>
                <section className='flex items-center justify-between border-b border-zinc-200 pb-4'>
                    <div>
                        <p className='font-light'>SEU PEDIDO</p>
                        <p className='font-medium'>3 Itens</p>
                    </div>
                    <div className='flex opacity-75'>
                        <Image className='shadow rounded-full' src={'/prato.png'} alt='Prato Nome' width={40} height={40} />
                        <Image className='shadow rounded-full ml-[-10]' src={'/prato.png'} alt='Prato Nome' width={40} height={40} />
                        <Image className='shadow rounded-full ml-[-10]' src={'/prato.png'} alt='Prato Nome' width={40} height={40} />
                    </div>
                </section>
                <section className='flex items-center justify-between border-b border-zinc-200 pb-4'>
                    <div>
                        <p className='font-light'>RETIRAR EM</p>
                        <p className='font-medium'>Restaurante & Sorveteria Spumoni</p>
                        <p>Rua Lorem Ipsum, 9999</p>
                    </div>
                    <button className='bg-zinc-200 p-2 rounded-full'>
                        <BiPencil />
                    </button>
                </section>
                <section className='flex flex-col border-b border-zinc-200 pb-4 gap-1'>
                    <p className='text-xs'>OBRIGATÓRIO</p>
                    <p className='text-sm'>QUANDO QUER RETIRAR SEU PEDIDO?</p>
                    <div className='flex gap-2'>
                        <label htmlFor="takeaway_now" className='flex flex-col items-start bg-zinc-200 p-2 w-1/4 rounded-md cursor-pointer'>
                            <input type="radio" name="delivery" id="takeaway_now" />
                            <span className='text-xs mt-2 mb-1'>RETIRAR AGORA</span>
                            <span className='text-xs mt-4'>Retirar em até 30 minutos</span>
                        </label>
                        <label htmlFor="takeaway_book" className='flex flex-col items-start bg-zinc-200 p-2 w-1/4 rounded-md cursor-pointer'>
                            <input type="radio" name="delivery" id="takeaway_book" />
                            <span className='text-xs mt-2 mb-1'>AGENDAR A RETIRADA</span>
                            <span className='text-xs mt-4'>Agende e tire quando puder</span>
                        </label>
                        <label htmlFor="delivery_now" className='flex flex-col items-start bg-zinc-200 p-2 w-1/4 rounded-md cursor-pointer'>
                            <input type="radio" name="delivery" id="delivery_now" />
                            <span className='text-xs mt-2 mb-1'>ENTREGAR AGORA</span>
                            <span className='text-xs mt-4'>O pedido será entregue</span>
                        </label>
                        <label htmlFor="delivery_book" className='flex flex-col items-start bg-zinc-200 p-2 w-1/4 rounded-md cursor-pointer'>
                            <input type="radio" name="delivery" id="delivery_book" />
                            <span className='text-xs mt-2 mb-1'>AGENDAR A ENTREGA</span>
                            <span className='text-xs mt-4'>Agende a entrega</span>
                        </label>
                    </div>
                </section>
                <section className='flex items-center justify-between border-b border-zinc-200 pb-4'>
                    <div>
                        <p className='font-light text-xs mb-1'>OBRIGATÓRIO</p>
                        <p>FORMA DE PAGAMENTO</p>
                    </div>
                    <button className='flex items-center gap-2 bg-zinc-200 py-1 px-3 rounded-full'>
                        <p className='text-sm'>Escolher</p>
                        <BiPlus />
                    </button>
                </section>
                <section className='flex items-center justify-between border-b border-zinc-200 pb-4'>
                    <div>
                        <p>CPF OU CNPJ NA NOTA</p>
                    </div>
                    <button className='flex items-center gap-2 bg-zinc-200 py-1 px-3 rounded-full'>
                        <p className='text-sm'>Incluir</p>
                        <BiPlus />
                    </button>
                </section>

                <section className='text-zinc-700'>
                    <p className='text-sm'>RESUMO</p>
                    <div className='flex justify-between items-center my-2 text-sm'>
                        <p>3 itens</p>
                        <p>R$ 00,00</p>
                    </div>
                    <div className='flex justify-between items-center my-2 text-sm'>
                        <p>Total</p>
                        <p>R$ 00,00</p>
                    </div>
                </section>
            </main>
            <section className='bg-white shadow-2xl fixed bottom-0 w-full max-w-full px-7 py-5 gap-4 flex flex-col md:max-w-7xl md:m-auto '>
                <button onClick={() => handleFinish()} className='flex justify-center items-center font-medium text-lg w-full bg-purple-principal-500 py-2.5 px-5 text-white rounded-xl'>
                    <p>FAZER PEDIDO</p>
                </button>
            </section>
        </>
    )
}

export default Carrinho