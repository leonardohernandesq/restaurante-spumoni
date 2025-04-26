'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiExit, BiListUl, BiPlus } from 'react-icons/bi';

import { IPedido } from '@/interfaces/IPedidosData';
import { PedidoRow } from '@/components/PedidoRow';
import { userStore } from '@/store/userStore';
import { getPedidos } from '@/services/pedido';

const Pedidos = () => {
    const { logout, clearUser } = userStore();
    const router = useRouter();
    const lastUpdatedRef = useRef<string | null>(null);

    const [pedidos, setPedidos] = useState<IPedido[]>([]);

    useEffect(() => {
        const loadPedidos = async () => {
            try {
                const after = lastUpdatedRef.current ?? undefined;
                const novos: IPedido[] = await getPedidos(after);

                if (novos && novos.length > 0) {
                    lastUpdatedRef.current = novos[novos.length - 1].updated_at;
                    setPedidos((prev) => {
                        const novosFiltrados = novos.filter(
                            (pedidoNovo) => !prev.some((pedidoExistente) => pedidoExistente.id === pedidoNovo.id)
                        );

                        return [...prev, ...novosFiltrados];
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar pedidos:', err);
            }
        };

        loadPedidos();
        const interval = setInterval(loadPedidos, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        clearUser();
        router.push('/admin');
    };

    return (
        <main className="p-5 bg-zinc-200">
            <section className="p-5 bg-white rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-purple-principal-700">Gestor de Pedidos</h1>
                    <button onClick={handleLogout}>
                        <BiExit size={25} className="text-red-800 cursor-pointer" />
                    </button>
                </div>

                <div className="flex justify-between items-center my-2">
                    <button onClick={() => router.push('/admin/adicionarprodutos')} className="flex items-center gap-1 text-lg cursor-pointer">
                        <BiPlus />
                        Adicionar Produto
                    </button>
                    <button onClick={() => router.push('/admin/listarprodutos')} className="flex items-center gap-1 text-lg cursor-pointer">
                        <BiListUl />
                        Lista de Produtos
                    </button>
                </div>

                <input
                    className="w-full border bg-zinc-100 border-zinc-200 p-2 rounded-lg my-4"
                    placeholder="Filtrar por nome, número do pedido ou telefone"
                />

                {pedidos.map((item) => (
                    <PedidoRow key={item.id} pedido={item} />
                ))}
            </section>
        </main>
    );
};

export default Pedidos;
