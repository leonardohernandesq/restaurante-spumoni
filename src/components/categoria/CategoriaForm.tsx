"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { FiEye, FiFileText } from "react-icons/fi";
import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import type { Categoria } from "@/types/categoria";
import { useCategoriaQuery, useCreateCategoria, useUpdateCategoria } from "@/queries/categorias";
import { transformString } from "@/utils/transformString";
import { SLUG_VALIDO } from "@/domain/produtoForm";

const CAMPO =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20";
const LIMITE_DESCRICAO = 200;

interface Form {
  nome: string;
  slug: string;
  descricao: string;
}

const VAZIO: Form = { nome: "", slug: "", descricao: "" };

const Cartao = ({ icone, titulo, descricao, children }: { icone: ReactNode; titulo: string; descricao?: string; children: ReactNode }) => (
  <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <header className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-principal-500/10 text-lg text-purple-principal-700">
        {icone}
      </span>
      <div>
        <h2 className="font-semibold text-zinc-900">{titulo}</h2>
        {descricao && <p className="text-sm text-zinc-500">{descricao}</p>}
      </div>
    </header>
    {children}
  </section>
);

/** Mensagem da API ou uma genérica. */
const mensagemDeErro = (err: unknown) =>
  (isAxiosError<{ message?: string; error?: string }>(err) &&
    (err.response?.data?.message || err.response?.data?.error)) ||
  "Tente novamente.";

/** Cadastro (sem id) ou edição (com id) de categoria. */
export const CategoriaForm = ({ id }: { id?: number }) => {
  const editando = id !== undefined;
  const router = useRouter();
  const categoriaQuery = useCategoriaQuery(id ?? 0);
  const criar = useCreateCategoria();
  const atualizar = useUpdateCategoria();
  const salvando = criar.isPending || atualizar.isPending;

  const [form, setForm] = useState<Form>(VAZIO);
  const [linkEditado, setLinkEditado] = useState(false);

  // Edição: preenche quando a categoria chega
  const servidor = editando ? categoriaQuery.data : undefined;
  useEffect(() => {
    if (servidor) {
      setForm({ nome: servidor.nome ?? "", slug: servidor.slug ?? "", descricao: servidor.descricao ?? "" });
    }
  }, [servidor]);

  const mudarNome = (nome: string) =>
    setForm((f) => ({ ...f, nome, slug: !editando && !linkEditado ? transformString(nome) : f.slug }));

  const salvar = async () => {
    if (!form.nome.trim()) return void toast.warn("Informe o nome da categoria.");
    if (!form.slug.trim()) return void toast.warn("Informe o link da categoria.");
    if (!editando && !SLUG_VALIDO.test(form.slug)) {
      return void toast.warn("O link só pode ter letras minúsculas, números e hífens (ex.: pratos-do-dia).");
    }

    const dados = { nome: form.nome.trim(), slug: form.slug, descricao: form.descricao.trim() };
    try {
      if (editando) {
        // Envia o slug atual: sem ele a API pode gravar a categoria sem slug
        await atualizar.mutateAsync({ id: id as number, ...dados } satisfies Categoria & { id: number });
        toast.success("Categoria atualizada!");
      } else {
        await criar.mutateAsync(dados);
        toast.success("Categoria criada!");
      }
      router.push("/admin/listarcategorias");
    } catch (err) {
      console.error(err);
      toast.error(`Não foi possível ${editando ? "salvar" : "criar"} a categoria. ${mensagemDeErro(err)}`);
    }
  };

  // Edição sem a categoria carregada: não mostra o formulário (salvar vazio apagaria os dados)
  if (editando && !servidor) {
    return (
      <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
        <HeaderPages title="Voltar às Categorias" />
        {categoriaQuery.isError ? (
          <ErrorState
            mensagem="Não foi possível carregar a categoria. Nada foi alterado."
            onRetry={() => categoriaQuery.refetch()}
            tentando={categoriaQuery.isFetching}
          />
        ) : (
          <LoadingState mensagem="Carregando categoria..." />
        )}
      </Container>
    );
  }

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen pb-28">
      <HeaderPages title="Voltar às Categorias" />

      <h1 className="mb-5 text-2xl font-semibold text-zinc-900">
        {editando ? form.nome || "Editar categoria" : "Nova categoria"}
      </h1>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_24rem]">
        <Cartao icone={<FiFileText />} titulo="Informações" descricao="Como a categoria aparece no cardápio.">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="nome" className="text-sm font-medium text-zinc-700">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                id="nome"
                className={CAMPO}
                placeholder="Ex.: Pratos do Dia"
                value={form.nome}
                onChange={(e) => mudarNome(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
                Link <span className="text-red-500">*</span>
              </label>
              <div className="flex items-stretch overflow-hidden rounded-lg border border-zinc-300 focus-within:border-purple-principal-500 focus-within:ring-2 focus-within:ring-purple-principal-500/20">
                <span className="flex items-center bg-zinc-100 px-3 text-sm text-zinc-500">#</span>
                <input
                  id="slug"
                  className="w-full bg-white px-3 py-2 outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
                  placeholder="pratos-do-dia"
                  value={form.slug}
                  disabled={editando}
                  onChange={(e) => {
                    setLinkEditado(true);
                    setForm((f) => ({ ...f, slug: transformString(e.target.value) }));
                  }}
                />
              </div>
              <p className="text-xs text-zinc-500">
                {editando
                  ? "O link não muda depois de criado."
                  : "Preenchido a partir do nome. Usado para pular até a categoria no cardápio."}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="descricao" className="text-sm font-medium text-zinc-700">
                Descrição
              </label>
              <textarea
                id="descricao"
                rows={3}
                maxLength={LIMITE_DESCRICAO}
                className={`${CAMPO} resize-y`}
                placeholder="Ex.: Pratos feitos na hora, servidos no almoço."
                value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              />
              <p className="self-end text-xs tabular-nums text-zinc-500">
                {form.descricao.length}/{LIMITE_DESCRICAO}
              </p>
            </div>
          </div>
        </Cartao>

        {/* Prévia: mesmo título e descrição da seção no cardápio */}
        <div className="lg:sticky lg:top-6">
          <Cartao icone={<FiEye />} titulo="Prévia" descricao="Assim o título aparece no cardápio.">
            <div className="rounded-xl bg-zinc-100 p-4">
              <p className="text-2xl font-medium text-zinc-900">
                {form.nome || <span className="text-zinc-400">Nome da categoria</span>}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {form.descricao || <span className="italic text-zinc-400">Sem descrição</span>}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2" aria-hidden>
                <div className="h-16 rounded-lg bg-white" />
                <div className="h-16 rounded-lg bg-white" />
              </div>
            </div>
          </Cartao>
        </div>
      </div>

      {/* Barra de salvar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-3 py-3">
          <button
            type="button"
            onClick={() => router.push("/admin/listarcategorias")}
            className="cursor-pointer rounded-lg px-4 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="cursor-pointer rounded-lg bg-purple-principal-700 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar categoria"}
          </button>
        </div>
      </div>
    </Container>
  );
};
