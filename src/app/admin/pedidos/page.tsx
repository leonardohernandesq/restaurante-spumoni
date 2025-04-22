'use client'

import { useEffect } from 'react';
import { PedidoRow } from '@/components/PedidoRow';
import { userStore } from '@/store/userStore';
import { usePedidoStore } from '@/store/pedidoStore';
import { useRouter } from 'next/navigation';
import { BiExit, BiListUl, BiPlus } from 'react-icons/bi';

const Pedidos = () => {
    const { logout, clearUser } = userStore();
    const { pedidos, getPedidos } = usePedidoStore();
    const router = useRouter();

    useEffect(() => {
        getPedidos(); // Puxa ao montar a página

        const ws = new WebSocket('wss://admin.lhdev.com.br:3000');

        ws.onopen = () => console.log('📡 Conectado ao WebSocket');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.tipo === 'updatePedidos') {
                console.log('🔄 Recebido update via WS');
                getPedidos(); // Atualiza pedidos do backend
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket erro:', err);
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleLogout = () => {
        logout();
        clearUser();
        router.push('/admin');
    };

    return (
        <main className='p-5 bg-zinc-200'>
            <section className='p-5 bg-white rounded-2xl shadow-2xl'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold text-purple-principal-700'>Gestor de Pedidos</h1>
                    <button onClick={() => handleLogout()}>
                        <BiExit size={25} className='text-red-800 cursor-pointer' />
                    </button>
                </div>
                <div className='flex justify-between items-center my-2'>
                    <button onClick={() => router.push('/admin/adicionarprodutos')} className='flex items-center gap-1 text-lg cursor-pointer'>
                        <BiPlus />
                        Adicionar Produto
                    </button>
                    <button onClick={() => router.push('/admin/listarprodutos')} className='flex items-center gap-1 text-lg cursor-pointer'>
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
    );
};

export default Pedidos;
