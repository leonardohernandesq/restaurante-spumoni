'use client'

import React, { useState } from 'react'
import { FaArrowLeft, FaCheckDouble, FaUserCheck } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { PiPrinter } from 'react-icons/pi';
import { FaMotorcycle } from 'react-icons/fa6';
import { FaTrashAlt } from 'react-icons/fa';
import NfPrint from '@/components/printer';

interface PedidoPageProps {
    params: { id: string };
}


export default function Pedido({ params }: PedidoPageProps) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    const handleSendNotification = () => {
        router.push('/admin/pedidos');
    }

    const handlePrint = () => {
        window.print();
    };


    return (
        <main>
            <header className='relative max-w-full px-7 py-5 flex items-center justify-between md:max-w-7xl md:m-auto bg-zinc-100'>
                <div className='flex items-center gap-4'>
                    <button className='p-2 bg-white rounded-full cursor-pointer' onClick={handleBack}>
                        <FaArrowLeft />
                    </button>
                    <h1>Voltar ao Gestor de Pedidos</h1>
                </div>
                <button onClick={handlePrint}>
                    <PiPrinter size={30} />
                </button>
            </header>

            <section className='relative max-w-full px-7 py-5 flex flex-col gap-4 md:max-w-7xl md:m-auto'>
                <div className=' p-2.5 border border-zinc-100 w-full rounded-md'>
                    <div className='flex items-center'>
                        <span className='py-1 px-3 bg-green-principal-700 text-white rounded-md'>Delivery (Entrega)</span>
                        <span className='py-1 px-3 font-medium'>Pedido: 9</span>
                        <div className='bg-purple-principal-700 w-4 h-0.5 rounded-full'></div>
                        <span className='py-1 px-3'>24/03 - 16:54</span>
                    </div>

                    <p className='font-medium mt-3'>Felipe</p>
                    <p>+55 (11) 99999-9999</p>
                    <p>Rua Logo Ali, 2000 - Poá, SP - 09663-000</p>
                </div>
                <div className='p-2.5 border border-zinc-100 w-full rounded-md'>
                    <h2 className='font-medium mb-2'>(Quinta-feira) - Bife Acebolado</h2>
                    <p>Tamanho: <span className='font-medium'> Grande</span></p>
                    <p>Vai precisar de talheres?: <span className='font-medium'> Sim</span></p>
                    <p>R$00,00</p>
                </div>
                <div className='p-2.5 border border-zinc-100 w-full rounded-md'>
                    <p>Delivery: <span className='font-medium'> R$00,00</span></p>
                    <p>Total: <span className='font-medium'> R$00,00</span></p>
                    <p>Forma de Pagamento: <span className='font-medium'> PIX</span></p>
                    <p>Observação: <span className='font-medium'>Lorem ipsum dolor sit amet</span></p>
                </div>

                <div className='w-full rounded-md flex border border-zinc-100'>
                    <button onClick={() => handleSendNotification()} className='text-center flex flex-col items-center gap-2 border-r border-zinc-100 p-3'>
                        <FaUserCheck size={20} />
                        <p className='text-sm/4 font-medium'>Confirmar Pedido</p>
                    </button>
                    <button onClick={() => handleSendNotification()} className='text-center flex flex-col items-center gap-2 border-r border-zinc-100 p-3'>
                        <FaMotorcycle size={20} />
                        <p className='text-sm/4 font-medium '>Saiu para Entrega</p>
                    </button>
                    <button onClick={() => handleSendNotification()} className='text-center flex flex-col items-center gap-2 border-r border-zinc-100 p-3'>
                        <FaCheckDouble size={20} />
                        <p className='text-sm/4 font-medium'>Finalizar Pedido</p>
                    </button>
                    <button onClick={() => handleSendNotification()} className='text-center flex flex-col items-center gap-2 border-r border-zinc-100 p-3'>
                        <FaTrashAlt size={20} />
                        <p className='text-sm/4 font-medium'>Cancelar Pedido</p>
                    </button>
                </div>
            </section>
            <NfPrint />
        </main>
    )
}
