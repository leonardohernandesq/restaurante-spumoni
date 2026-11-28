import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import type { IProductFormData } from "@/interfaces/IProductFormData";
import { useCategoriasQuery } from "@/queries/categorias";
import { useProdutoQuery, useSaveProduto } from "@/queries/produtos";
import {
  formularioParaFormData,
  formularioVazio,
  produtoParaFormulario,
  validarProduto,
} from "@/domain/produtoForm";

/** Mensagem da API (ex.: "Imagem inválida...") ou uma genérica. */
const mensagemDeErro = (error: unknown): string => {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    const dados = error.response?.data;
    if (dados?.error || dados?.message) return String(dados.error || dados.message);
    if (!error.response) return "Sem conexão com o servidor.";
  }
  return "Tente novamente.";
};

/** Formulário de produto: cadastro (sem slug) ou edição (com slug). */
export const useProductForm = (slugParam?: string) => {
  const router = useRouter();

  const categoriasQuery = useCategoriasQuery();
  const produtoQuery = useProdutoQuery(slugParam);
  const categories = categoriasQuery.data ?? [];
  const { data: produto, isLoading: carregandoProduto } = produtoQuery;

  // Na edição, salvar um formulário vazio (produto não carregou) apagaria o
  // produto. Sem categorias, não dá para escolher a categoria.
  const erroAoCarregar =
    (!!slugParam && produtoQuery.isError && !produto) ||
    (categoriasQuery.isError && !categoriasQuery.data);

  const tentarDeNovo = () => {
    categoriasQuery.refetch();
    if (slugParam) produtoQuery.refetch();
  };
  const saveProduto = useSaveProduto();

  const [formData, setFormData] = useState<IProductFormData>(formularioVazio);

  // Na edição, preenche o formulário quando o produto chega
  useEffect(() => {
    if (produto) {
      setFormData(
        produtoParaFormulario(produto, process.env.NEXT_PUBLIC_IMAGE_PATH),
      );
    }
  }, [produto]);

  const handleSubmit = async () => {
    const erro = validarProduto(formData, { editando: !!slugParam });
    if (erro) {
      toast.warn(erro.mensagem);
      document
        .getElementById(`campo-${erro.campo}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (
      formData.ativo &&
      !formData.diasDisponiveis.some(Boolean) &&
      !confirm("Nenhum dia marcado: o produto não vai aparecer no cardápio. Salvar mesmo assim?")
    ) {
      return;
    }

    try {
      await saveProduto.mutateAsync({
        slug: slugParam,
        form: formularioParaFormData(formData),
      });

      toast.success(
        `Produto ${slugParam ? "editado" : "cadastrado"} com sucesso!!`,
      );
      router.push("/admin/listarprodutos");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error(
        `Não foi possível ${slugParam ? "salvar" : "cadastrar"} o produto. ${mensagemDeErro(error)}`,
      );
    }
  };

  return {
    formData,
    setFormData,
    categories,
    handleSubmit,
    loading: saveProduto.isPending || (!!slugParam && carregandoProduto),
    erroAoCarregar,
    tentando: categoriasQuery.isFetching || produtoQuery.isFetching,
    tentarDeNovo,
  };
};
