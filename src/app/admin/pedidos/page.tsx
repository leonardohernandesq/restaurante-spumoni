"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PedidoRow } from "@/components/PedidoRow";
import { useStatusColor } from "@/hooks/useStatusColor";
import { Container } from "@/components/Container";
import { AdminMenu } from "@/components/AdminMenu";
import { usePedidosQuery } from "@/hooks/usePedidosQuery";

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
