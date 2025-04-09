'use client'

import { HeaderPages } from '@/components/header-pages'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BiPencil, BiTrash } from 'react-icons/bi'
import { FaMinus, FaPlus } from 'react-icons/fa6'


const Carrinho = () => {
    const [quantidade, setQuantidade] = useState(1);

    const router = useRouter();

    const handleCheckout = () => {
        router.push('/finalizar');
    }

    return (
        <>
            <HeaderPages title='Confira seu Pedido' />
            <main className='relative max-w-full px-7 py-5 gap-4 flex flex-col md:max-w-7xl md:m-auto bg-zinc-100 flex-1 h-screen'>
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
                    <div className='flex justify-between items-center mb-2'>
                        <div className=''>
                            <p className='font-light'>SEU PEDIDO (1 ITEM)</p>
                            <p className='font-medium'>(Quinta-feira) - Bife Acebolado</p>
                        </div>
                        <p className='font-medium'>R$ 00,00</p>
                    </div>
                    <p className='text-sm'>
                        Suculento bife acebolado grelhado na chapa, acompanhado de arroz soltinho,
                        feijão caseiro temperado na medida certa, crocantes batatas fritas douradas
                        e salada fresca com alface e legumes selecionados.
                    </p>

                    <section className='flex gap-2 mt-4'>
                        <div className="flex items-center justify-center gap-2 text-xs bg-purple-principal-500 text-white px-2 py-0.5 rounded-full w-fit">
                            <button className="p-1" onClick={() => setQuantidade(quantidade - 1)}>
                                <FaMinus />
                            </button>
                            <span>{quantidade}</span>
                            <button className="p-1" onClick={() => setQuantidade(quantidade + 1)}>
                                <FaPlus />
                            </button>
                        </div>
                        <button className='bg-zinc-200 p-2 rounded-full w-fit'>
                            <BiTrash />
                        </button>
                    </section>
                </section>
                <section className='flex justify-between items-center text-zinc-700'>
                    <p>SUBTOTAL</p>
                    <p>R$ 00,00</p>
                </section>
            </main>
            <section className='bg-white shadow-2xl fixed bottom-0 w-full max-w-full px-7 py-5 gap-4 flex flex-col md:max-w-7xl md:m-auto '>
                <button onClick={() => handleCheckout()} className='flex justify-between items-center font-medium text-lg w-full bg-purple-principal-500 py-2.5 px-5 text-white rounded-xl'>
                    <p>Continuar</p>
                    <p>R$ 00,00</p>
                </button>
            </section>
        </>
    )
}

export default Carrinho