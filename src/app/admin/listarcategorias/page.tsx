"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { FiEdit2, FiPlus, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import { Container } from "@/components/Container";
import { TituloAdmin } from "@/components/admin/TituloAdmin";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import type { Categoria } from "@/types/categoria";
import { useCategoriasQuery, useDeleteCategoria } from "@/queries/categorias";
import { ordenarComDestaque } from "@/domain/categoria";
import { CATEGORIA_DESTAQUE } from "@/constants/app";

const semAcento = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const ListarCategorias = () => {
  const { data = [], isPending, isError, isFetching, refetch } = useCategoriasQuery();
  const deleteCategory = useDeleteCategoria();
  const router = useRouter();
  const [busca, setBusca] = useState("");

  // Mesma ordem do cardápio (a categoria de destaque primeiro)
  const categorias = useMemo(() => {
    const termo = semAcento(busca);
    return ordenarComDestaque(data, (c) => c.nome).filter(
      (c) => !termo || semAcento(`${c.nome ?? ""} ${c.descricao ?? ""}`).includes(termo),
    );
  }, [data, busca]);

  const totalProdutos = data.reduce((s, c) => s + Number(c.total_produtos ?? 0), 0);

  const excluir = async (categoria: Categoria) => {
    if (!confirm(`Excluir a categoria "${categoria.nome}"? Não dá para desfazer.`)) return;
    try {
      await deleteCategory.mutateAsync(categoria.id);
      toast.success(`Categoria "${categoria.nome}" excluída.`);
    } catch (err) {
      console.error(err);
      const msg = isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
      toast.error(msg || "Não foi possível excluir a categoria.");
    }
  };

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
      <div className="py-4">
        <TituloAdmin title="Categorias" />
      </div>

      {isError && data.length === 0 ? (
        <ErrorState
          mensagem="Não foi possível carregar as categorias."
          onRetry={() => refetch()}
          tentando={isFetching}
        />
      ) : isPending ? (
        <LoadingState mensagem="Carregando categorias..." />
      ) : (
        <>
          {/* ---------- Barra ---------- */}
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Buscar categoria</span>
              <FiSearch aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                placeholder="Buscar categoria"
                className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </label>
            <p className="text-sm text-zinc-500 sm:px-2">
              {data.length} {data.length === 1 ? "categoria" : "categorias"} · {totalProdutos}{" "}
              {totalProdutos === 1 ? "produto" : "produtos"}
            </p>
            <Link
              href="/admin/adicionarcategorias"
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-principal-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              <FiPlus aria-hidden /> Nova categoria
            </Link>
          </div>

          {categorias.length === 0 ? (
            <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
              {busca ? "Nenhuma categoria encontrada." : "Nenhuma categoria cadastrada ainda."}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categorias.map((categoria) => {
                const qtd = Number(categoria.total_produtos ?? 0);
                const destaque = categoria.nome === CATEGORIA_DESTAQUE;
                return (
                  <article
                    key={categoria.id}
                    className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-zinc-900" title={categoria.nome}>
                          {categoria.nome}
                        </h2>
                        {categoria.slug && <p className="truncate text-xs text-zinc-400">#{categoria.slug}</p>}
                      </div>
                      {destaque && (
                        <span
                          className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                          title="Aparece primeiro no cardápio"
                        >
                          <FiStar aria-hidden /> Destaque
                        </span>
                      )}
                    </div>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-zinc-600">
                      {categoria.descricao || <span className="italic text-zinc-400">Sem descrição</span>}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3">
                      <Link
                        href={`/admin/listarprodutos#${categoria.slug ?? ""}`}
                        className={`rounded-full px-2.5 py-1 text-sm font-medium transition ${
                          qtd > 0
                            ? "bg-purple-principal-500/10 text-purple-principal-700 hover:bg-purple-principal-500/20"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                        title="Ver os produtos desta categoria"
                      >
                        {qtd} {qtd === 1 ? "produto" : "produtos"}
                      </Link>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/editarcategorias/${categoria.id}`)}
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                        >
                          <FiEdit2 aria-hidden /> Editar
                        </button>
                        {/* A API não exclui categoria com produtos: explica em vez de falhar */}
                        <button
                          type="button"
                          onClick={() => excluir(categoria)}
                          disabled={qtd > 0 || deleteCategory.isPending}
                          aria-label={`Excluir ${categoria.nome}`}
                          title={
                            qtd > 0
                              ? `Para excluir, mova ou exclua os ${qtd} produtos desta categoria antes.`
                              : "Excluir categoria"
                          }
                          className="cursor-pointer rounded-lg p-2.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
                        >
                          <FiTrash2 aria-hidden />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ListarCategorias;
