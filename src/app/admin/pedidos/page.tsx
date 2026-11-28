"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { FiBell, FiSearch, FiX } from "react-icons/fi";
import { PedidoRow } from "@/components/PedidoRow";
import { useStatusColor } from "@/hooks/useStatusColor";
import { Container } from "@/components/Container";
import { TituloAdmin } from "@/components/admin/TituloAdmin";
import { Pagination } from "@/components/ui/Pagination";
import {
  ErrorState,
  LoadingState,
  StaleWarning,
} from "@/components/ui/QueryState";
import {
  usePedidosQuery,
  usePedidosRecentesQuery,
} from "@/queries/pedidos";
import {
  descreverContagemPedidos,
  getNovosPedidos,
} from "@/domain/pedidoStatus";
import { DEFAULT_PER_PAGE, PER_PAGE_OPTIONS } from "@/constants/app";

const ESPERA_BUSCA_MS = 300;

const Pedidos = () => {
  const [filtro, setFiltro] = useState("");
  const [busca, setBusca] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [mostrarExcluidos, setMostrarExcluidos] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(DEFAULT_PER_PAGE);
  const [showModal, setShowModal] = useState(false);

  // Espera parar de digitar antes de buscar no servidor
  useEffect(() => {
    const t = setTimeout(() => setBusca(filtro.trim()), ESPERA_BUSCA_MS);
    return () => clearTimeout(t);
  }, [filtro]);

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } =
    usePedidosQuery({
    page,
    perPage,
    status: selectedStatuses,
    busca,
    excluidos: mostrarExcluidos,
  });
  const pedidos = data?.data ?? [];
  const pagination = data?.pagination;
  const contagem = data?.contagem;
  const resumoFiltro = pagination
    ? descreverContagemPedidos(
        pagination.total,
        { status: selectedStatuses, excluidos: mostrarExcluidos },
        contagem,
      )
    : "";
  // Alerta sonoro: sempre olha os mais recentes, mesmo filtrando/paginando
  const { data: recentes } = usePedidosRecentesQuery();

  const hasInteractedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // null = ainda não recebeu a primeira lista (não toca som na carga inicial)
  const idsConhecidosRef = useRef<Set<number> | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // Toca o som quando o polling traz um pedido novo
  useEffect(() => {
    const lista = recentes?.data;
    if (!lista) return;

    const ids = lista.map((p) => p.id);

    if (idsConhecidosRef.current === null) {
      idsConhecidosRef.current = new Set(ids);
      return;
    }

    const novos = getNovosPedidos(idsConhecidosRef.current, lista);
    ids.forEach((id) => idsConhecidosRef.current!.add(id));

    if (novos.length > 0 && hasInteractedRef.current) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => console.warn("Áudio não pôde tocar"));
      }
    }
  }, [recentes]);

  const { statusOptions, getColor } = useStatusColor();

  const handleStatusChange = (statusId: number) => {
    setPage(1);
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

    // Tocar uma vez dentro do clique libera o áudio para os próximos pedidos
    audioRef.current
      ?.play()
      .catch(() => console.warn("Áudio não pôde tocar"));
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

  // Filtro novo = volta para a página 1 (a busca só muda após a espera)
  const [buscaAnterior, setBuscaAnterior] = useState(busca);
  if (busca !== buscaAnterior) {
    setBuscaAnterior(busca);
    setPage(1);
  }

  const temFiltro =
    filtro.trim() !== "" || selectedStatuses.length > 0 || mostrarExcluidos;

  // Tira busca e filtros de uma vez (a busca limpa na hora, sem esperar)
  const limparFiltros = () => {
    setFiltro("");
    setBusca("");
    setSelectedStatuses([]);
    setMostrarExcluidos(false);
    setPage(1);
  };

  // Relógio da tela: atualiza o "há X min" a cada 30 s
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const handlePerPage = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  // A página pode ficar fora do intervalo (ex.: pedidos mudaram de status)
  const lastPage = pagination?.lastPage ?? 1;
  if (pagination && page > lastPage) setPage(lastPage);

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen pb-10">
      <div className="py-4">
        <TituloAdmin title="Gestor de Pedidos" />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-principal-500/10 text-2xl text-green-principal-700">
              <FiBell aria-hidden />
            </span>
            <p className="font-semibold text-zinc-900">Ativar o som de pedido novo</p>
            <p className="mt-1 text-sm text-zinc-600">
              O navegador só toca som depois de um clique. Clique para ouvir quando chegar pedido.
            </p>
            <button
              className="mt-5 w-full cursor-pointer rounded-lg bg-green-principal-500 px-4 py-2.5 font-semibold text-white transition hover:brightness-110"
              onClick={handleUserInteraction}
            >
              Ativar som
            </button>
          </div>
        </div>
      )}

      {/* ---------- Busca e filtros ---------- */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <label className="relative">
          <span className="sr-only">Buscar pedido</span>
          <FiSearch aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20"
            placeholder="Buscar por nome, número do pedido ou telefone"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2" aria-label="Filtrar por status">
          {statusOptions.map(({ id, label }) => {
            const ativo = selectedStatuses.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={ativo}
                onClick={() => handleStatusChange(id)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  ativo
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
              >
                <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${getColor(id)}`} />
                {label}
                {contagem && (
                  <span className={`tabular-nums ${ativo ? "text-white/70" : "text-zinc-400"}`}>
                    {contagem.status[id]?.toLocaleString("pt-BR") ?? 0}
                  </span>
                )}
              </button>
            );
          })}

          {/* Não é um status: o pedido excluído mantém o status dele */}
          <span aria-hidden className="mx-1 h-5 w-px bg-zinc-300" />
          <button
            type="button"
            aria-pressed={mostrarExcluidos}
            onClick={() => {
              setPage(1);
              setMostrarExcluidos((v) => !v);
            }}
            className={`flex cursor-pointer items-center gap-2 rounded-full border border-dashed px-3 py-1.5 text-sm font-medium transition ${
              mostrarExcluidos
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"
            }`}
          >
            Excluídos
            {contagem && (
              <span className={`tabular-nums ${mostrarExcluidos ? "text-white/70" : "text-zinc-400"}`}>
                {contagem.excluidos.toLocaleString("pt-BR")}
              </span>
            )}
          </button>

          {temFiltro && (
            <button
              type="button"
              onClick={limparFiltros}
              className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
            >
              <FiX aria-hidden />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Polling falhou mas há lista antiga: avisar, senão a cozinha
          acha que não chegaram pedidos novos */}
      {isError && data && (
        <StaleWarning mensagem="Sem conexão com o servidor. A lista pode estar desatualizada; tentando de novo a cada 5 segundos." />
      )}

      {resumoFiltro && (
        <p className="mb-1 px-1 text-sm text-zinc-700" aria-live="polite">
          <strong className="font-semibold">{resumoFiltro}</strong>
          {busca && <span className="text-zinc-500"> para &quot;{busca}&quot;</span>}
        </p>
      )}

      {isPending ? (
        <LoadingState mensagem="Carregando pedidos..." />
      ) : isError && !data ? (
        <ErrorState
          mensagem="Não foi possível carregar os pedidos."
          onRetry={() => refetch()}
          tentando={isFetching}
        />
      ) : pedidos.length === 0 ? (
        <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
          Nenhum pedido encontrado.
        </p>
      ) : (
        <>
          {/* Trocando de página/filtro: a lista anterior fica, esmaecida */}
          <div className={isPlaceholderData ? "opacity-50 transition-opacity" : undefined}>
            {pedidos.map((item, i) => (
              <Fragment key={item.id}>
                {/* Excluídos vêm sempre no fim (ordenado no servidor) */}
                {item.excluido && !pedidos[i - 1]?.excluido && (
                  <p className="mt-6 mb-1 border-t border-dashed border-zinc-300 pt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Pedidos excluídos · não contam nas estatísticas
                  </p>
                )}
                <PedidoRow pedido={item} agora={agora} />
              </Fragment>
            ))}
          </div>

          {pagination && pagination.lastPage > 1 && (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <Pagination
                page={page}
                totalPages={pagination.lastPage}
                onPageChange={(p) => setPage(Math.min(Math.max(1, p), pagination.lastPage))}
                resumo={resumoFiltro}
                perPage={perPage}
                perPageOptions={PER_PAGE_OPTIONS}
                onPerPageChange={handlePerPage}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Pedidos;
