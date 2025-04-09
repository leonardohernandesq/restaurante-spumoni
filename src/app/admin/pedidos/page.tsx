'use client'

import { PedidoRow } from '@/components/pedido-row';
import NfPrint from '@/components/printer';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { BiExit, BiListUl, BiPlus } from 'react-icons/bi'

const Pedidos = () => {
    const router = useRouter();

    const [pedidos, setPedidos] = useState([
        {
            "id": '1',
            "client_name": "Leonardo",
            "client_phone": "+55 (11) 99999-9999",
            "status": "Confirmado",
            "created_at": "08/04 - 12:00",
        },
        {
            "id": '2',
            "client_name": "Leonardo",
            "client_phone": "+55 (11) 99999-9999",
            "status": "Cancelado",
            "created_at": "08/04 - 12:00",
        },
        {
            "id": '3',
            "client_name": "Leonardo",
            "client_phone": "+55 (11) 99999-9999",
            "status": "Saindo para entrega",
            "created_at": "08/04 - 12:00",
        },
        {
            "id": '4',
            "client_name": "Leonardo",
            "client_phone": "+55 (11) 99999-9999",
            "status": "Novo Pedido",
            "created_at": "08/04 - 12:00",
        },
        {
            "id": '5',
            "client_name": "Leonardo",
            "client_phone": "+55 (11) 99999-9999",
            "status": "Preparando",
            "created_at": "08/04 - 12:00",
        },
        {
            "id": '6',
            "client_name": "Leonardo",
            "client_phone": "+55 (11) 99999-9999",
            "status": "Confirmado",
            "created_at": "08/04 - 12:00",
        },
        {
            "id": '7',
            "client_name": "Leonardo",
            "client_phone": "+55 (11) 99999-9999",
            "status": "Confirmado",
            "created_at": "08/04 - 12:00",
        },
    ]);

    const handleLogout = () => {
        router.push('/admin');
    }

    return (
        <main className='p-5 bg-zinc-200'>
            <section className='p-5 bg-white rounded-2xl shadow-2xl'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold text-purple-principal-700'>Gestor de Pedidos</h1>
                    <button onClick={() => handleLogout()}><BiExit size={25} className='text-red-800' /></button>
                </div>
                <div className='flex justify-between items-center my-2'>
                    <button className='flex items-center gap-1 text-lg'>
                        <BiPlus />
                        Adicionar Produto
                    </button>
                    <button className='flex items-center gap-1 text-lg'>
                        <BiListUl />
                        Lista de Produtos
                    </button>
                </div>
                <input className='w-full border bg-zinc-100 border-zinc-200 p-2 rounded-lg my-4' placeholder='Filtrar por nome, número do pedido ou telefone' />

                {
                    pedidos.map((item) => (
                        <PedidoRow key={item.id} pedido={item} />
                    ))
                }

            </section>
        </main>
    )
}

export default Pedidos