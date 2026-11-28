"use client";

import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Produto } from "@/types/produto";
import { useAlternarProdutoAtivo, useDeleteProduto } from "@/queries/produtos";
import { formatCurrencyBRL } from "@/utils/format";
import { DIAS_PRODUTO } from "@/domain/produtoForm";
import { STATUS_PRODUTO, rotuloStatus, statusDoProduto } from "@/domain/produtoLista";

interface ListProductsItemProps {
  product: Produto;
  /** Dia olhado na lista (1 = domingo … 7 = sábado); padrão: hoje. */
  dia?: number;
  /** Dia de hoje na convenção do produto (1 = domingo … 7 = sábado). */
  diaHoje: number;
}

export const ListProductsItem = ({ product, dia: diaOlhado, diaHoje }: ListProductsItemProps) => {
  const dia = diaOlhado ?? diaHoje;
  const router = useRouter();
  const deleteProduto = useDeleteProduto();
  const alternarAtivo = useAlternarProdutoAtivo();

  const status = statusDoProduto(product, dia);
  const info = STATUS_PRODUTO[status];
  const ativo = status !== "inativo";
  const dias = (product.available_days ?? []).map(Number);
  const descricao = product.description ?? product.descricao;

  const editar = () => router.push(`/admin/editarprodutos/${product.slug}`);

  const excluir = async () => {
    if (!confirm(`Excluir "${product.name}"? Ele sai do cardápio e não dá para desfazer.`)) return;
    try {
      await deleteProduto.mutateAsync(product.id);
      toast.success(`"${product.name}" foi excluído.`);
    } catch (error) {
      console.error(error);
      toast.error(`Não foi possível excluir "${product.name}".`);
    }
  };

  const alternar = () =>
    alternarAtivo.mutate(product.id, {
      onSuccess: () =>
        toast.success(ativo ? `"${product.name}" saiu do cardápio.` : `"${product.name}" voltou ao cardápio.`),
      onError: () => toast.error("Não foi possível mudar o produto."),
    });

  return (
    <article
      className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 ${
        ativo ? "" : "bg-zinc-50"
      }`}
    >
      {/* Foto + textos */}
      <button
        type="button"
        onClick={editar}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-left"
      >
        <span className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 ${ativo ? "" : "grayscale"}`}>
          {product.image_url && (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${product.image_url}`}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className={`font-semibold ${ativo ? "text-zinc-900" : "text-zinc-500"}`}>{product.name}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${info.classe}`}>{rotuloStatus(status, dia, diaHoje)}</span>
          </span>
          {descricao && <span className="mt-0.5 line-clamp-1 block text-sm text-zinc-500">{descricao}</span>}
          <span className="mt-1 flex items-center gap-3">
            <span className="font-medium tabular-nums text-zinc-800">
              {formatCurrencyBRL(Number(product.price ?? product.preco ?? 0))}
            </span>
            {/* Dias da semana: marcados em roxo; dia olhado sublinhado */}
            <span className="flex gap-0.5" aria-label={`Dias: ${dias.map((d) => DIAS_PRODUTO[d - 1]).join(", ") || "nenhum"}`}>
              {DIAS_PRODUTO.map((nomeDia, i) => (
                <span
                  key={nomeDia}
                  title={nomeDia}
                  className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold ${
                    dias.includes(i + 1) ? "bg-purple-principal-500/15 text-purple-principal-700" : "text-zinc-300"
                  } ${i + 1 === dia ? "underline underline-offset-2" : ""}`}
                  aria-hidden
                >
                  {nomeDia[0]}
                </span>
              ))}
            </span>
          </span>
        </span>
      </button>

      {/* Ações */}
      <div className="flex items-center justify-end gap-1 sm:shrink-0">
        <label className="mr-2 flex cursor-pointer items-center gap-2 text-sm text-zinc-600" title="Aparece no cardápio">
          <span className="sm:sr-only">No cardápio</span>
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={ativo}
            disabled={alternarAtivo.isPending}
            onChange={alternar}
            aria-label={`${product.name} aparece no cardápio`}
          />
          <span className="relative h-6 w-10 shrink-0 rounded-full bg-zinc-300 transition peer-checked:bg-green-principal-500 peer-focus-visible:ring-2 peer-focus-visible:ring-green-principal-500 peer-disabled:opacity-50 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4" />
        </label>
        <button
          type="button"
          onClick={editar}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          <FiEdit2 aria-hidden /> Editar
        </button>
        <button
          type="button"
          onClick={excluir}
          disabled={deleteProduto.isPending}
          aria-label={`Excluir ${product.name}`}
          title="Excluir produto"
          className="cursor-pointer rounded-lg p-2.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <FiTrash2 aria-hidden />
        </button>
      </div>
    </article>
  );
};
