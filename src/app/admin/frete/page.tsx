"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TituloAdmin } from "@/components/admin/TituloAdmin";
import { Container } from "@/components/Container";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import type { Frete } from "@/types/frete";
import { toast } from "react-toastify";
import { FiPlus, FiSearch, FiTrash2, FiTruck } from "react-icons/fi";
import { isFreteAlterado } from "@/domain/frete";
import {
  useAllFretesQuery,
  useCreateFrete,
  useDeleteFrete,
  useUpdateFrete,
} from "@/queries/fretes";

/** Linha editável: `chave` identifica a linha (fretes novos ainda não têm id). */
type Linha = Frete & { chave: string };

const TODAS = "";

const CAMPO =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20";

const normalizarFrete = (f: Frete): Frete => ({
  id: f.id,
  bairro: f.bairro ?? "",
  preco: f.preco ?? "",
  cidade: f.cidade ?? "",
});

const paraLinha = (f: Frete): Linha => ({ ...normalizarFrete(f), chave: `id-${f.id}` });

/** Compara textos sem acento e sem diferença de maiúsculas. */
const semAcento = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const porNome = (a: string, b: string) => a.localeCompare(b, "pt-BR");

let contadorNovos = 0;

const FreteConfig = () => {
  const { data, refetch, isPending, isError, isFetching } = useAllFretesQuery();
  const createFrete = useCreateFrete();
  const updateFrete = useUpdateFrete();
  const deleteFrete = useDeleteFrete();

  // Valores do servidor (para saber o que mudou) e cópia editável na tela
  const originais = useMemo(() => (data ?? []).map(normalizarFrete), [data]);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [cidade, setCidade] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Carrega a tela só uma vez. Depois disso o servidor só a substitui ao
  // salvar: excluir um frete recarrega a lista e apagaria edições não salvas.
  const carregado = useRef(false);
  useEffect(() => {
    if (data && !carregado.current) {
      carregado.current = true;
      setLinhas(data.map(paraLinha));
    }
  }, [data]);

  // Cidades com a quantidade de bairros, pela cidade salva no servidor
  const cidades = useMemo(() => {
    const contagem = new Map<string, number>();
    for (const f of originais) {
      const nome = f.cidade.trim() || "Sem cidade";
      contagem.set(nome, (contagem.get(nome) ?? 0) + 1);
    }
    return [...contagem.entries()]
      .map(([nome, total]) => ({ nome, total }))
      .sort((a, b) => porNome(a.nome, b.nome));
  }, [originais]);

  // Começa na cidade com mais bairros
  useEffect(() => {
    if (cidade === null && cidades.length) {
      setCidade([...cidades].sort((a, b) => b.total - a.total)[0].nome);
    }
  }, [cidade, cidades]);

  // Cidade salva de cada frete (por id)
  const cidadePorId = useMemo(
    () => new Map(originais.map((f) => [f.id, f.cidade.trim() || "Sem cidade"])),
    [originais],
  );

  // Filtra pela cidade salva (mudar a cidade de uma linha não a faz sumir da
  // tela antes de salvar). Fretes novos aparecem sempre, no fim.
  const visiveis = useMemo(() => {
    const termo = semAcento(busca);
    const existentes = linhas
      .filter((l) => l.id)
      .filter((l) => !cidade || cidadePorId.get(l.id) === cidade)
      .filter((l) => !termo || semAcento(l.bairro).includes(termo))
      .sort((a, b) => porNome(a.bairro, b.bairro));
    return [...existentes, ...linhas.filter((l) => !l.id)];
  }, [linhas, cidade, busca, cidadePorId]);


  const handleAddFrete = () => {
    contadorNovos += 1;
    setLinhas((atual) => [
      ...atual,
      { chave: `novo-${contadorNovos}`, bairro: "", preco: "", cidade: cidade || "" },
    ]);
  };

  const handleChange = (chave: string, campo: keyof Omit<Frete, "id">, valor: string) => {
    setLinhas((atual) => atual.map((l) => (l.chave === chave ? { ...l, [campo]: valor } : l)));
  };

  const handleDelete = async (linha: Linha) => {
    if (linha.id) {
      const nome = linha.bairro || "este frete";
      if (!confirm(`Tem certeza que deseja deletar o frete de ${nome}?`)) return;
      try {
        await deleteFrete.mutateAsync(Number(linha.id));
        toast.success("Frete removido!");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao deletar frete");
        return;
      }
    }
    setLinhas((atual) => atual.filter((l) => l.chave !== linha.chave));
  };

  const handleSaveAll = async () => {
    const incompletos = linhas.filter((l) => !l.id && (!l.bairro.trim() || !l.cidade.trim()));
    if (incompletos.length) {
      toast.warn("Preencha bairro e cidade dos fretes novos antes de salvar.");
      return;
    }

    setSalvando(true);
    try {
      await Promise.all(
        linhas.map(async (linha) => {
          const { chave: _chave, ...frete } = linha;
          if (!frete.id) {
            await createFrete.mutateAsync(frete);
            return;
          }
          const original = originais.find((f) => f.id === frete.id);
          if (original && isFreteAlterado(original, frete)) {
            await updateFrete.mutateAsync({ id: Number(frete.id), frete });
          }
        }),
      );

      // Recarrega do servidor (fretes novos recebem id)
      const { data: atualizados } = await refetch();
      if (atualizados) setLinhas(atualizados.map(paraLinha));

      toast.success("Fretes salvos com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar fretes");
    } finally {
      setSalvando(false);
    }
  };

  const alterada = (linha: Linha) => {
    if (!linha.id) return true;
    const original = originais.find((f) => f.id === linha.id);
    return original ? isFreteAlterado(original, linha) : false;
  };
  const alteradas = linhas.filter(alterada).length;

  // Aviso ao sair da página com alterações não salvas
  useEffect(() => {
    if (!alteradas) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [alteradas]);


  const existentesVisiveis = visiveis.filter((l) => l.id).length;

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen pb-28">
      <div className="py-4">
        <TituloAdmin title="Frete">
          <button
            type="button"
            onClick={handleAddFrete}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-purple-principal-700 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            <FiPlus aria-hidden /> Novo bairro
          </button>
        </TituloAdmin>
        <p className="mt-1 text-sm text-zinc-500">
          Valor da entrega por bairro. O cliente vê esse valor ao escolher o bairro no checkout.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <label className="sm:w-72">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Cidade</span>
          <select
            className={`${CAMPO} cursor-pointer`}
            value={cidade ?? TODAS}
            onChange={(e) => setCidade(e.target.value)}
            disabled={!cidades.length}
          >
            <option value={TODAS}>Todas as cidades ({originais.length})</option>
            {cidades.map((c) => (
              <option key={c.nome} value={c.nome}>
                {c.nome} ({c.total} {c.total === 1 ? "bairro" : "bairros"})
              </option>
            ))}
          </select>
        </label>

        <label className="sm:flex-1">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Buscar bairro</span>
          <span className="relative block">
            <FiSearch aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Nome do bairro"
              className={`${CAMPO} pl-9`}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </span>
        </label>
      </div>

      <p className="mb-2 px-1 text-sm text-zinc-700" aria-live="polite">
        <strong className="font-semibold">
          {existentesVisiveis} {existentesVisiveis === 1 ? "bairro" : "bairros"}
        </strong>
        {cidade ? <span className="text-zinc-500"> em {cidade}</span> : null}
        {busca && <span className="text-zinc-500"> para &quot;{busca}&quot;</span>}
      </p>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {isPending && <LoadingState mensagem="Carregando fretes..." />}
        {isError && !data && (
          <ErrorState
            mensagem="Não foi possível carregar os fretes."
            onRetry={() => refetch()}
            tentando={isFetching}
          />
        )}
        {data && visiveis.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-10 text-center text-zinc-500">
            <FiTruck aria-hidden className="text-3xl text-zinc-300" />
            {busca ? "Nenhum bairro encontrado com essa busca." : "Nenhum bairro nesta cidade."}
          </div>
        )}

        {visiveis.length > 0 && (
          <div
            aria-hidden
            className="hidden grid-cols-[1fr_1fr_9rem_2.5rem] gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:grid"
          >
            <span>Bairro</span>
            <span>Cidade</span>
            <span>Preço</span>
            <span />
          </div>
        )}

        <ul className="divide-y divide-zinc-100">
          {visiveis.map((frete) => {
            const mudou = alterada(frete);
            return (
              <li
                key={frete.chave}
                className={`relative grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[1fr_1fr_9rem_2.5rem] ${
                  !frete.id ? "bg-green-50" : mudou ? "bg-amber-50/60" : ""
                }`}
              >
                {(mudou || !frete.id) && (
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-1 ${frete.id ? "bg-amber-400" : "bg-green-500"}`}
                  />
                )}
                <label className="col-span-2 sm:col-span-1">
                  <span className="mb-1 flex items-center gap-2 text-xs text-zinc-500 sm:hidden">Bairro</span>
                  <span className="relative block">
                    <input
                      type="text"
                      placeholder="Nome do bairro"
                      className={CAMPO}
                      value={frete.bairro}
                      onChange={(e) => handleChange(frete.chave, "bairro", e.target.value)}
                    />
                    {!frete.id && (
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                        novo
                      </span>
                    )}
                  </span>
                </label>
                <label>
                  <span className="mb-1 block text-xs text-zinc-500 sm:hidden">Cidade</span>
                  <input
                    type="text"
                    placeholder="Cidade"
                    list="cidades-frete"
                    className={CAMPO}
                    value={frete.cidade}
                    onChange={(e) => handleChange(frete.chave, "cidade", e.target.value)}
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs text-zinc-500 sm:hidden">Preço</span>
                  <span className="flex items-stretch overflow-hidden rounded-lg border border-zinc-300 bg-white focus-within:border-purple-principal-500 focus-within:ring-2 focus-within:ring-purple-principal-500/20">
                    <span className="flex items-center bg-zinc-100 px-2.5 text-sm text-zinc-500">R$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      className="w-full min-w-0 px-2.5 py-2 tabular-nums outline-none"
                      value={frete.preco}
                      onChange={(e) => handleChange(frete.chave, "preco", e.target.value)}
                    />
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDelete(frete)}
                  title={frete.id ? "Excluir bairro" : "Descartar bairro novo"}
                  aria-label={`Excluir frete de ${frete.bairro || "bairro novo"}`}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600 sm:self-center"
                >
                  <FiTrash2 aria-hidden className="text-lg" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sugestões de cidade ao digitar (as já cadastradas) */}
      <datalist id="cidades-frete">
        {cidades.map((c) => (
          <option key={c.nome} value={c.nome} />
        ))}
      </datalist>

      {/* Barra de salvar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3">
          <p className="text-sm text-zinc-600">
            {alteradas > 0 ? (
              <span className="flex items-center gap-2 font-medium text-amber-700">
                <span aria-hidden className="h-2 w-2 rounded-full bg-amber-500" />
                {alteradas} {alteradas === 1 ? "alteração não salva" : "alterações não salvas"}
              </span>
            ) : (
              "Tudo salvo"
            )}
          </p>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={salvando || alteradas === 0}
            className="cursor-pointer rounded-lg bg-purple-principal-700 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </Container>
  );
};

export default FreteConfig;
