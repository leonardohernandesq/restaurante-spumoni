"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "nextjs-toploader/app";
import { FiCalendar, FiFileText, FiImage, FiLayers, FiPlus, FiTrash2 } from "react-icons/fi";
import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { ErrorState } from "@/components/ui/QueryState";
import { Ajuda } from "@/components/ui/Ajuda";
import { FotoProduto } from "@/components/produto/FotoProduto";
import { useProductForm } from "@/hooks/useProductForm";
import type { IProductFormData } from "@/interfaces/IProductFormData";
import { calcularPrecoUnitario } from "@/domain/pricing";
import { formatCurrencyBRL } from "@/utils/format";
import { transformString } from "@/utils/transformString";
import {
  DIAS_PRODUTO,
  adicionarAtributo,
  adicionarValorAoAtributo,
  alternarDiaDisponivel,
  atualizarAtributo,
  atualizarValorAtributo,
  marcarTodosOsDias,
  removerAtributo,
  removerValorAtributo,
} from "@/domain/produtoForm";

const CAMPO =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";
const CAMPO_PEQUENO =
  "w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20";

/* ---------- Peças visuais ---------- */

const Cartao = ({
  id,
  icone,
  titulo,
  descricao,
  ajuda,
  children,
}: {
  id?: string;
  icone: ReactNode;
  titulo: string;
  descricao?: string;
  ajuda?: ReactNode;
  children: ReactNode;
}) => (
  <section id={id} className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <header className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-principal-500/10 text-lg text-purple-principal-700">
        {icone}
      </span>
      <div>
        <h2 className="flex items-center gap-1 font-semibold text-zinc-900">
          {titulo}
          {ajuda && <Ajuda rotulo={`Ajuda: ${titulo}`}>{ajuda}</Ajuda>}
        </h2>
        {descricao && <p className="text-sm text-zinc-500">{descricao}</p>}
      </div>
    </header>
    {children}
  </section>
);

const Campo = ({
  id,
  rotulo,
  obrigatorio,
  dica,
  children,
}: {
  id: string;
  rotulo: string;
  obrigatorio?: boolean;
  dica?: ReactNode;
  children: ReactNode;
}) => (
  <div id={`campo-${id}`} className="flex scroll-mt-6 flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-zinc-700">
      {rotulo} {obrigatorio && <span className="text-red-500">*</span>}
    </label>
    {children}
    {dica && <p className="text-xs text-zinc-500">{dica}</p>}
  </div>
);

/* ---------- Formulário ---------- */

interface ProductFormProps {
  /** Sem slug = cadastro; com slug = edição daquele produto. */
  slug?: string;
}

export const ProductForm = ({ slug }: ProductFormProps) => {
  const editando = !!slug;
  const router = useRouter();
  const {
    formData,
    setFormData,
    categories,
    handleSubmit,
    loading,
    erroAoCarregar,
    tentando,
    tentarDeNovo,
  } = useProductForm(slug);

  // No cadastro, o link acompanha o nome até a pessoa editar o link
  const [linkEditado, setLinkEditado] = useState(false);

  const editar = (alterar: (form: IProductFormData) => IProductFormData) =>
    setFormData((atual) => alterar(atual));

  const handleChange = <K extends keyof IProductFormData>(campo: K, valor: IProductFormData[K]) =>
    editar((form) => ({ ...form, [campo]: valor }));

  const mudarNome = (nome: string) =>
    editar((form) => ({
      ...form,
      nome,
      slug: !editando && !linkEditado ? transformString(nome) : form.slug,
    }));

  if (erroAoCarregar) {
    return (
      <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
        <HeaderPages title="Voltar ao Gestor de Produtos" />
        <ErrorState
          mensagem={
            editando
              ? "Não foi possível carregar o produto. Nada foi alterado."
              : "Não foi possível carregar as categorias."
          }
          onRetry={tentarDeNovo}
          tentando={tentando}
        />
      </Container>
    );
  }

  const diasMarcados = formData.diasDisponiveis.filter(Boolean).length;
  const precoCliente = (preco: string, incluido: boolean) =>
    preco.trim() === "" && !incluido
      ? null
      : formatCurrencyBRL(
          calcularPrecoUnitario(formData.preco.replace(",", "."), [
            { preco: preco.replace(",", "."), preco_incluido: incluido },
          ]),
        );

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen pb-28">
      <HeaderPages title="Voltar ao Gestor de Produtos" />

      <h1 className="mb-5 text-2xl font-semibold text-zinc-900">
        {editando ? formData.nome || "Editar produto" : "Novo produto"}
      </h1>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_22rem]">
        {/* ================= Coluna principal ================= */}
        <div className="flex flex-col gap-5">
          <Cartao icone={<FiFileText />} titulo="Informações" descricao="O que o cliente vê no cardápio.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Campo id="nome" rotulo="Nome do produto" obrigatorio>
                  <input
                    id="nome"
                    className={CAMPO}
                    placeholder="Ex.: Bife acebolado"
                    value={formData.nome}
                    onChange={(e) => mudarNome(e.target.value)}
                  />
                </Campo>
              </div>

              <div className="sm:col-span-2">
                <Campo
                  id="slug"
                  rotulo="Link do produto"
                  obrigatorio
                  dica={
                    editando
                      ? "O link não muda depois de criado (é como o produto é encontrado)."
                      : "Preenchido a partir do nome. Só letras minúsculas, números e hífens."
                  }
                >
                  <div className="flex items-stretch overflow-hidden rounded-lg border border-zinc-300 focus-within:border-purple-principal-500 focus-within:ring-2 focus-within:ring-purple-principal-500/20">
                    <span className="flex items-center bg-zinc-100 px-3 text-sm text-zinc-500">/produto/</span>
                    <input
                      id="slug"
                      className="w-full bg-white px-3 py-2 outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
                      placeholder="bife-acebolado"
                      value={formData.slug}
                      disabled={editando}
                      onChange={(e) => {
                        setLinkEditado(true);
                        handleChange("slug", transformString(e.target.value));
                      }}
                    />
                  </div>
                </Campo>
              </div>

              <Campo id="categoria" rotulo="Categoria" obrigatorio>
                <select
                  id="categoria"
                  className={`${CAMPO} cursor-pointer`}
                  value={formData.categoria_id}
                  onChange={(e) => handleChange("categoria_id", e.target.value)}
                >
                  <option value="">Escolha a categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo
                id="preco"
                rotulo="Preço base"
                dica="Sem opções, é o preço do prato. Opções podem somar ou substituir este valor."
              >
                <div className="flex items-stretch overflow-hidden rounded-lg border border-zinc-300 focus-within:border-purple-principal-500 focus-within:ring-2 focus-within:ring-purple-principal-500/20">
                  <span className="flex items-center bg-zinc-100 px-3 text-sm text-zinc-500">R$</span>
                  <input
                    id="preco"
                    inputMode="decimal"
                    className="w-full bg-white px-3 py-2 outline-none"
                    placeholder="0,00"
                    value={formData.preco}
                    onChange={(e) => handleChange("preco", e.target.value)}
                  />
                </div>
              </Campo>

              <div className="sm:col-span-2">
                <Campo id="descricao" rotulo="Descrição">
                  <textarea
                    id="descricao"
                    rows={3}
                    className={`${CAMPO} resize-y`}
                    placeholder="Ex.: Arroz, feijão, bife acebolado e salada."
                    value={formData.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                  />
                </Campo>
              </div>
            </div>
          </Cartao>

          {/* ---------- Opções ---------- */}
          <Cartao
            id="campo-opcoes"
            icone={<FiLayers />}
            titulo="Opções do prato"
            descricao="Tamanhos, acompanhamentos, adicionais... Deixe em branco se não tiver."
            ajuda={
              <>
                <p>
                  Cada opção (ex.: <strong>Tamanho</strong>) tem escolhas (ex.: Pequena, Média).
                </p>
                <p>
                  <strong>Soma ao preço:</strong> a escolha é um adicional (ex.: + R$ 3,00 de ovo).
                </p>
                <p>
                  <strong>Substitui o preço:</strong> a escolha já é o preço do prato (ex.: Média = R$
                  26,00, em vez do preço base).
                </p>
                <p>
                  <strong>Máximo de escolhas:</strong> quantas o cliente pode marcar. Em branco = sem
                  limite.
                </p>
              </>
            }
          >
            <div className="flex flex-col gap-4">
              {formData.atributos.map((atributo, i) => (
                // Índice como key: opções novas ainda não têm atributo_id
                <div key={i} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
                  <div className="flex items-center gap-2">
                    <input
                      aria-label={`Nome da opção ${i + 1}`}
                      className={`${CAMPO} font-medium`}
                      placeholder="Nome da opção (ex.: Tamanho)"
                      value={atributo.nomes_atributos}
                      onChange={(e) => editar((f) => atualizarAtributo(f, i, "nomes_atributos", e.target.value))}
                    />
                    <button
                      type="button"
                      aria-label={`Remover a opção ${atributo.nomes_atributos || i + 1}`}
                      title="Remover opção"
                      onClick={() => editar((f) => removerAtributo(f, i))}
                      className="cursor-pointer rounded-lg p-2.5 text-red-600 transition hover:bg-red-50"
                    >
                      <FiTrash2 aria-hidden />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-700">
                    <label className="flex h-9 cursor-pointer items-center gap-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-purple-principal-700"
                        checked={atributo.obrigatorio}
                        onChange={(e) => editar((f) => atualizarAtributo(f, i, "obrigatorio", e.target.checked))}
                      />
                      Cliente precisa escolher
                    </label>
                    <label className="flex h-9 items-center gap-2 whitespace-nowrap">
                      Máximo de escolhas
                      <input
                        type="number"
                        min={1}
                        className="h-9 w-28 shrink-0 rounded-md border border-zinc-300 bg-white px-2.5 text-sm outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20"
                        placeholder="Sem limite"
                        value={atributo.limite ?? ""}
                        onChange={(e) =>
                          editar((f) =>
                            atualizarAtributo(f, i, "limite", e.target.value ? parseInt(e.target.value) : null),
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* Escolhas */}
                  <div className="mt-4">
                    <div className="hidden grid-cols-[1fr_7rem_11rem_6.5rem_2.25rem] gap-2 px-1 pb-1 text-xs font-medium text-zinc-500 md:grid">
                      <span>Escolha</span>
                      <span>Preço</span>
                      <span>Como o preço funciona</span>
                      <span>Cliente paga</span>
                      <span />
                    </div>
                    <div className="flex flex-col gap-2">
                      {atributo.valores_atributo.map((valor, j) => {
                        const paga = precoCliente(valor.preco, valor.preco_incluido);
                        return (
                          <div
                            key={j}
                            className="grid grid-cols-2 items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 md:grid-cols-[1fr_7rem_11rem_6.5rem_2.25rem] md:border-0 md:bg-transparent md:p-0"
                          >
                            <input
                              aria-label="Nome da escolha"
                              className={`${CAMPO_PEQUENO} col-span-2 md:col-span-1`}
                              placeholder="Ex.: Média"
                              value={valor.valor}
                              onChange={(e) => editar((f) => atualizarValorAtributo(f, i, j, "valor", e.target.value))}
                            />
                            <input
                              aria-label="Preço da escolha"
                              inputMode="decimal"
                              className={CAMPO_PEQUENO}
                              placeholder="0,00"
                              value={valor.preco}
                              onChange={(e) => editar((f) => atualizarValorAtributo(f, i, j, "preco", e.target.value))}
                            />
                            <select
                              aria-label="Como o preço funciona"
                              className={`${CAMPO_PEQUENO} cursor-pointer`}
                              value={valor.preco_incluido ? "substitui" : "soma"}
                              onChange={(e) =>
                                editar((f) =>
                                  atualizarValorAtributo(f, i, j, "preco_incluido", e.target.value === "substitui"),
                                )
                              }
                            >
                              <option value="soma">Soma ao preço</option>
                              <option value="substitui">Substitui o preço</option>
                            </select>
                            <span className="text-sm tabular-nums text-zinc-700">
                              <span className="text-xs text-zinc-500 md:hidden">Cliente paga </span>
                              {paga ?? "—"}
                            </span>
                            <button
                              type="button"
                              aria-label={`Remover a escolha ${valor.valor || j + 1}`}
                              title="Remover escolha"
                              onClick={() => editar((f) => removerValorAtributo(f, i, j))}
                              className="cursor-pointer justify-self-end rounded-md p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <FiTrash2 aria-hidden />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => editar((f) => adicionarValorAoAtributo(f, i))}
                      className="mt-2 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-purple-principal-700 transition hover:bg-purple-principal-500/10"
                    >
                      <FiPlus aria-hidden /> Adicionar escolha
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => editar(adicionarAtributo)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 font-medium text-zinc-600 transition hover:border-purple-principal-500 hover:text-purple-principal-700"
              >
                <FiPlus aria-hidden /> Adicionar opção
              </button>
            </div>
          </Cartao>
        </div>

        {/* ================= Coluna lateral ================= */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-6">
          <Cartao
            id="campo-imagem"
            icone={<FiImage />}
            titulo="Foto"
            descricao={editando ? "Envie outra para trocar." : "Obrigatória."}
          >
            <FotoProduto urlInicial={formData.imageUrl} onEscolher={(arquivo) => handleChange("image", arquivo)} />
          </Cartao>

          <Cartao icone={<FiCalendar />} titulo="Disponibilidade">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span>
                <span className="block font-medium text-zinc-900">Aparece no cardápio</span>
                <span className="block text-sm text-zinc-500">
                  {formData.ativo ? "Clientes podem pedir" : "Escondido do cardápio"}
                </span>
              </span>
              <input
                type="checkbox"
                role="switch"
                className="peer sr-only"
                checked={formData.ativo}
                onChange={() => handleChange("ativo", !formData.ativo)}
              />
              <span className="relative h-7 w-12 shrink-0 rounded-full bg-zinc-300 transition peer-checked:bg-green-principal-500 peer-focus-visible:ring-2 peer-focus-visible:ring-green-principal-500 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
            </label>

            <div className={`mt-5 ${formData.ativo ? "" : "opacity-50"}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">Dias da semana</span>
                <button
                  type="button"
                  onClick={() => editar((f) => marcarTodosOsDias(f, diasMarcados < 7))}
                  className="cursor-pointer text-xs font-medium text-purple-principal-700 hover:underline"
                >
                  {diasMarcados < 7 ? "Marcar todos" : "Desmarcar todos"}
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DIAS_PRODUTO.map((dia, i) => {
                  const marcado = formData.diasDisponiveis[i];
                  return (
                    <button
                      key={dia}
                      type="button"
                      aria-pressed={marcado}
                      onClick={() => editar((f) => alternarDiaDisponivel(f, i))}
                      className={`cursor-pointer rounded-lg py-2 text-xs font-semibold transition ${
                        marcado
                          ? "bg-purple-principal-700 text-white"
                          : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
              <p className={`mt-2 text-xs ${diasMarcados === 0 ? "font-medium text-red-600" : "text-zinc-500"}`}>
                {diasMarcados === 0
                  ? "Nenhum dia marcado: o produto não aparece no cardápio."
                  : diasMarcados === 7
                    ? "Disponível todos os dias."
                    : "Só aparece no cardápio nos dias marcados."}
              </p>
            </div>
          </Cartao>
        </div>
      </div>

      {/* ---------- Barra de salvar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-3 py-3">
          <button
            type="button"
            onClick={() => router.push("/admin/listarprodutos")}
            className="cursor-pointer rounded-lg px-4 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer rounded-lg bg-purple-principal-700 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </div>
      </div>
    </Container>
  );
};
