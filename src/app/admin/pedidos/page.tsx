'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiListUl, BiPlus } from 'react-icons/bi';

import { IPedido } from '@/interfaces/IPedidosData';
import { PedidoRow } from '@/components/PedidoRow';
import { fetchPedidosAPI } from '@/services/pedido';
import { useStatusColor } from '@/hooks/useStatusColor';
import { Container } from '@/components/Container';
import { AdminMenu } from '@/components/AdminMenu';

const Pedidos = () => {
    const router = useRouter();

    const [pedidos, setPedidos] = useState<IPedido[]>([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const lastUpdatedRef = useRef<string | null>(null);
    const isLoadingRef = useRef(false);

    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
    const { statusOptions, getColor } = useStatusColor();

    const handleStatusChange = (statusId: number) => {
        setSelectedStatuses((prev) =>
            prev.includes(statusId)
                ? prev.filter((s) => s !== statusId)
                : [...prev, statusId]
        );
    };

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const carregarPedidosIniciais = async () => {
            try {
                const pedidos = await fetchPedidosAPI();
                const formatados = pedidos.map(p => ({ ...p, status: Number(p.status) }));
                if (isMounted && formatados.length > 0) {
                    const last = formatados[formatados.length - 1].data_pedido;
                    if (last) {
                        lastUpdatedRef.current = new Date(last).toISOString();
                    }
                    setPedidos(formatados);
                }
            } catch (err) {
                console.error('Erro ao carregar pedidos iniciais:', err);
            } finally {
                setLoading(false);
            }
        };

        const buscarNovosPedidosPeriodicamente = async () => {
            if (isLoadingRef.current) return;
            isLoadingRef.current = true;

            try {
                const after = lastUpdatedRef.current ?? undefined;
                let novos = await fetchPedidosAPI(after);
                novos = novos.map(p => ({ ...p, status: Number(p.status) }));

                if (isMounted && novos.length > 0) {
                    const last = novos[novos.length - 1].data_pedido;
                    if (last) {
                        lastUpdatedRef.current = new Date(last).toISOString();
                    }

                    setPedidos((prev) => {
                        const novosFiltrados = novos.filter(
                            (pedidoNovo) => !prev.some((pedidoExistente) => pedidoExistente.id === pedidoNovo.id)
                        );
                        return [...prev, ...novosFiltrados];
                    });
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Erro ao buscar novos pedidos:', err);
                }
            } finally {
                isLoadingRef.current = false;
            }
        };

        carregarPedidosIniciais();
        const interval = setInterval(buscarNovosPedidosPeriodicamente, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);


    const pedidosFiltrados = pedidos.filter((p) => {
        const matchesFiltro =
            p.nome_cliente.toLowerCase().includes(filtro.toLowerCase()) ||
            p.telefone.toString().includes(filtro) ||
            p.id?.toString().includes(filtro);

        const matchesStatus =
            selectedStatuses.length === 0 || selectedStatuses.includes(p.status!);

        return matchesFiltro && matchesStatus;
    });


    return (
        <Container styleRow='bg-zinc-200'>
            <main className="p-5 min-h-screen h-full">
                <section className="p-5 bg-white rounded-2xl shadow-2xl">
                    <AdminMenu title='Gestor de Pedidos' />


                    <input
                        className="w-full border bg-zinc-100 border-zinc-200 p-2 rounded-lg my-4"
                        placeholder="Filtrar por nome, número do pedido ou telefone"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />

                    <div className='mb-5'>
                        <h2>Filtrar por Status</h2>
                        <div className='flex gap-5 flex-wrap mt-2'>
                            {statusOptions.map(({ id, label }) => {
                                const accentColor = getColor(id).replace('bg', 'accent');

                                return (
                                    <div key={id} className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            id={`status-${id}`}
                                            checked={selectedStatuses.includes(id)}
                                            onChange={() => handleStatusChange(id)}
                                            className={`w-5 h-5 rounded focus:ring-0 focus:outline-none ${accentColor}`}
                                        />
                                        <label htmlFor={`status-${id}`} className="text-sm text-gray-800">
                                            {label}
                                        </label>
                                    </div>
                                );
                            })}

                        </div>
                    </div>

                    {loading && <p className="text-center text-zinc-600">Carregando...</p>}
                    {!loading && pedidosFiltrados.length === 0 ? (
                        <p className="text-center text-zinc-600">Nenhum pedido encontrado.</p>
                    ) : (
                        pedidosFiltrados.map((item) => (
                            <PedidoRow key={item.id} pedido={item} />
                        ))
                    )}
                </section>
            </main>
        </Container>
    );
};

export default Pedidos;
