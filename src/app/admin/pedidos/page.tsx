"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PedidoRow } from "@/components/PedidoRow";
import { useStatusColor } from "@/hooks/useStatusColor";
import { Container } from "@/components/Container";
import { AdminMenu } from "@/components/AdminMenu";
import { usePedidosQuery } from "@/hooks/usePedidosQuery";
import { usePedidosPagination } from "@/hooks/usePedidosPagination";

const Pedidos = () => {
  const { data: pedidos = [], isLoading } = usePedidosQuery();
  const [filtro, setFiltro] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const hasInteractedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { statusOptions, getColor } = useStatusColor();

  const handleStatusChange = (statusId: number) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((s) => s !== statusId)
        : [...prev, statusId],
    );
  };

  const handleUserInteraction = () => {
    hasInteractedRef.current = true;
    setShowModal(false);

    localStorage.setItem(
      "sound-enabled",
      JSON.stringify({ value: true, timestamp: Date.now() }),
    );

    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => console.log("Áudio não pôde tocar"));
    audioRef.current = audio;
  };

  useEffect(() => {
    const item = localStorage.getItem("sound-enabled");
    if (item) {
      try {
        const { value, timestamp } = JSON.parse(item);
        const isExpired = Date.now() - timestamp > 8 * 60 * 60 * 1000;
        if (!isExpired && value === true) {
          hasInteractedRef.current = true;
          return;
        }
        localStorage.removeItem("sound-enabled");
      } catch {
        localStorage.removeItem("sound-enabled");
      }
    }
    setShowModal(true);
  }, []);

  // Filtragem com useMemo
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const matchesFiltro =
        p.nome_cliente.toLowerCase().includes(filtro.toLowerCase()) ||
        p.telefone.toString().includes(filtro) ||
        p.id?.toString().includes(filtro);

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(p.status!);

      return matchesFiltro && matchesStatus;
    });
  }, [pedidos, filtro, selectedStatuses]);

  // Reset para página 1 ao mudar filtro ou status
  const prevFiltroRef = useRef(filtro);
  const prevStatusRef = useRef(selectedStatuses);
  const {
    pedidosPaginados,
    pagination,
    setPage,
    setPerPage,
    goToNext,
    goToPrev,
  } = usePedidosPagination(pedidosFiltrados, 20);

  useEffect(() => {
    if (
      prevFiltroRef.current !== filtro ||
      prevStatusRef.current !== selectedStatuses
    ) {
      setPage(1);
      prevFiltroRef.current = filtro;
      prevStatusRef.current = selectedStatuses;
    }
  }, [filtro, selectedStatuses, setPage]);

  return (
    <Container styleRow="bg-zinc-200">
      <main className="p-5 min-h-screen h-full">
        <section className="p-5 bg-white rounded-2xl shadow-2xl">
          <AdminMenu title="Gestor de Pedidos" />

          {showModal && (
            <div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded-lg text-center">
                <p className="mb-4">
                  Para ativar as notificações sonoras, clique em{" "}
                  <strong>entendido</strong>.
                </p>
                <button
                  className="bg-green-principal-500 hover:bg-green-principal-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={handleUserInteraction}
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          <input
            className="w-full border bg-zinc-100 border-zinc-200 p-2 rounded-lg my-4"
            placeholder="Filtrar por nome, número do pedido ou telefone"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <div className="mb-5">
            <h2>Filtrar por Status</h2>
            <div className="flex gap-5 flex-wrap mt-2">
              {statusOptions.map(({ id, label }) => {
                const accentColor = getColor(id).replace("bg", "accent");
                return (
                  <div key={id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={`status-${id}`}
                      checked={selectedStatuses.includes(id)}
                      onChange={() => handleStatusChange(id)}
                      className={`w-5 h-5 rounded focus:ring-0 focus:outline-none ${accentColor}`}
                    />
                    <label
                      htmlFor={`status-${id}`}
                      className="text-sm text-gray-800"
                    >
                      {label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {isLoading && (
            <p className="text-center text-zinc-600">Carregando...</p>
          )}
          {!isLoading && pedidosFiltrados.length === 0 ? (
            <p className="text-center text-zinc-600">
              Nenhum pedido encontrado.
            </p>
          ) : (
            <>
              {pedidosPaginados.map((item) => (
                <PedidoRow key={item.id} pedido={item} />
              ))}

              {/* Paginação */}
              {pagination.lastPage > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-200">
                  {/* Seletor de itens por página */}
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <span>Itens por página:</span>
                    {[10, 20, 50].map((n) => (
                      <button
                        key={n}
                        onClick={() => setPerPage(n)}
                        className={`px-2 py-1 rounded cursor-pointer text-sm ${
                          pagination.perPage === n
                            ? "bg-green-principal-700 text-white font-semibold"
                            : "bg-zinc-100 hover:bg-zinc-200"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  {/* Controles de página */}
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-zinc-500">
                      {pagination.total} pedidos · Página{" "}
                      <strong>{pagination.page}</strong> de{" "}
                      <strong>{pagination.lastPage}</strong>
                    </span>
                    <button
                      onClick={goToPrev}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm font-medium"
                    >
                      ← Anterior
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={pagination.page >= pagination.lastPage}
                      className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm font-medium"
                    >
                      Próxima →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </Container>
  );
};

export default Pedidos;
