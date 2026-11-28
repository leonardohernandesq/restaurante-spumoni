"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { Container } from "@/components/Container";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import { CategoryScroll } from "@/components/CategoryScroll";
import { ListProductsItem } from "@/components/ListProductsItem";
import { TituloAdmin } from "@/components/admin/TituloAdmin";
import { useCategoriasQuery } from "@/queries/categorias";
import { useProdutosQuery } from "@/queries/produtos";
import { DIAS_PRODUTO } from "@/domain/produtoForm";
import {
  STATUS_PRODUTO,
  diaDoProdutoHoje,
  quandoDia,
  produtoCombina,
  statusDoProduto,
  type StatusProduto,
} from "@/domain/produtoLista";

type Filtro = "todos" | StatusProduto;
const FILTROS: Filtro[] = ["todos", "hoje", "fora", "inativo"];

const ListarProdutos = () => {
  const categoriasQuery = useCategoriasQuery();
  // true = inclui produtos inativos (o admin precisa ver todos)
  const produtosQuery = useProdutosQuery(true);
  const categories = categoriasQuery.data ?? [];
  const products = useMemo(() => produtosQuery.data ?? [], [produtosQuery.data]);

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const diaHoje = diaDoProdutoHoje();
  // Dia olhado na lista (padrão: hoje). Muda o que conta como "no cardápio".
  const [dia, setDia] = useState(diaHoje);

  const escolherDia = (d: number) => {
    setDia(d);
    // Escolher um dia é para ver o cardápio dele
    if (d !== diaHoje && filtro === "todos") setFiltro("hoje");
  };

  // Quantos produtos em cada status (com a busca aplicada)
  const daBusca = useMemo(() => products.filter((p) => produtoCombina(p, busca)), [products, busca]);
  const contagem = useMemo(() => {
    const c: Record<Filtro, number> = { todos: daBusca.length, hoje: 0, fora: 0, inativo: 0 };
    daBusca.forEach((p) => c[statusDoProduto(p, dia)]++);
    return c;
  }, [daBusca, dia]);

  const visiveis = useMemo(
    () => (filtro === "todos" ? daBusca : daBusca.filter((p) => statusDoProduto(p, dia) === filtro)),
    [daBusca, filtro, dia],
  );
  const filtrando = busca.trim() !== "" || filtro !== "todos" || dia !== diaHoje;

  const carregando = categoriasQuery.isPending || produtosQuery.isPending;

  // Veio de um link "#categoria" (ex.: lista de categorias): rola até ela
  // depois que os produtos carregam (antes disso o elemento não existe).
  useEffect(() => {
    if (carregando || !window.location.hash) return;
    document
      .getElementById(decodeURIComponent(window.location.hash.slice(1)))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [carregando]);
  const deuErro =
    (categoriasQuery.isError && !categoriasQuery.data) || (produtosQuery.isError && !produtosQuery.data);

  const tentarDeNovo = () => {
    categoriasQuery.refetch();
    produtosQuery.refetch();
  };

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
      <div className="py-4 px-2">
        <TituloAdmin title="Produtos" />
      </div>

      {deuErro ? (
        <ErrorState
          mensagem="Não foi possível carregar os produtos."
          onRetry={tentarDeNovo}
          tentando={categoriasQuery.isFetching || produtosQuery.isFetching}
        />
      ) : carregando ? (
        <LoadingState mensagem="Carregando produtos..." />
      ) : (
        <>
          {/* ---------- Barra de busca e filtros ---------- */}
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Buscar produto</span>
                <FiSearch aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  placeholder="Buscar por nome ou descrição"
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </label>
              <Link
                href="/admin/adicionarprodutos"
                className="flex items-center justify-center gap-2 rounded-lg bg-purple-principal-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                <FiPlus aria-hidden /> Novo produto
              </Link>
            </div>

            {/* Dia da semana olhado */}
            <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Dia da semana">
              <span className="mr-1 text-sm font-medium text-zinc-600">Dia:</span>
              {DIAS_PRODUTO.map((nome, i) => {
                const d = i + 1;
                const marcado = dia === d;
                return (
                  <button
                    key={nome}
                    type="button"
                    role="radio"
                    aria-checked={marcado}
                    onClick={() => escolherDia(d)}
                    className={`relative cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      marcado
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {nome}
                    {d === diaHoje && (
                      <span
                        className={`ml-1 text-[11px] font-semibold uppercase ${marcado ? "text-white/70" : "text-purple-principal-700"}`}
                      >
                        hoje
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Filtrar por situação">
              {FILTROS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={filtro === f}
                  onClick={() => setFiltro(f)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    filtro === f
                      ? "border-purple-principal-700 bg-purple-principal-700 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-purple-principal-500"
                  }`}
                >
                  {f === "todos"
                    ? "Todos"
                    : f === "hoje"
                      ? `No cardápio ${quandoDia(dia, diaHoje)}`
                      : STATUS_PRODUTO[f].filtro}{" "}
                  <span className={filtro === f ? "text-white/80" : "text-zinc-400"}>({contagem[f]})</span>
                </button>
              ))}
              {filtrando && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    setFiltro("todos");
                    setDia(diaHoje);
                  }}
                  className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
                >
                  <FiX aria-hidden /> Limpar
                </button>
              )}
            </div>
          </div>

          {!filtrando && <CategoryScroll categories={categories} />}

          {/* ---------- Produtos por categoria ---------- */}
          <section className="mt-4 mb-10 flex flex-col gap-6">
            {visiveis.length === 0 && (
              <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
                Nenhum produto encontrado.
              </p>
            )}

            {categories.map((categoria) => {
              const daCategoria = visiveis.filter((p) => Number(p.categoria_id) === Number(categoria.id));
              // Filtrando, esconde categorias sem resultado
              if (filtrando && daCategoria.length === 0) return null;

              return (
                <div id={categoria.slug} key={categoria.id} className="scroll-mt-20">
                  <h2 className="mb-2 flex items-baseline gap-2 px-1 text-lg font-semibold text-zinc-900">
                    {categoria.nome}
                    <span className="text-sm font-normal text-zinc-500">
                      {daCategoria.length} {daCategoria.length === 1 ? "produto" : "produtos"}
                    </span>
                  </h2>

                  {daCategoria.length > 0 ? (
                    <div className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                      {daCategoria.map((product) => (
                        <ListProductsItem key={product.id} product={product} dia={dia} diaHoje={diaHoje} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
                      Nenhum produto nesta categoria.
                    </p>
                  )}
                </div>
              );
            })}
          </section>
        </>
      )}
    </Container>
  );
};

export default ListarProdutos;
