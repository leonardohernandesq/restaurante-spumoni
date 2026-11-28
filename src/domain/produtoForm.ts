import type {
  IAtributo,
  IProductFormData,
  IValorAtributo,
} from "@/interfaces/IProductFormData";
import type { Produto } from "@/types/produto";

const valorVazio = (): IValorAtributo => ({
  valor_atributo_id: null,
  valor: "",
  preco: "",
  preco_incluido: false,
});

export const atributoVazio = (): IAtributo => ({
  atributo_id: null,
  nomes_atributos: "",
  limite: null,
  obrigatorio: false,
  valores_atributo: [valorVazio()],
});

/** Formulário em branco (cadastro de produto novo). */
export const formularioVazio = (): IProductFormData => ({
  id: 0,
  nome: "",
  slug: "",
  descricao: "",
  preco: "",
  categoria_id: "",
  ativo: true,
  image: null,
  imageUrl: null,
  atributos: [atributoVazio()],
  // Todos os dias: o cardápio só mostra o produto nos dias marcados
  diasDisponiveis: Array(7).fill(true),
});

/** Produto vindo da API → estado do formulário de edição. */
export const produtoParaFormulario = (
  produto: Produto,
  caminhoImagens = "",
): IProductFormData => {
  const atributos: IAtributo[] = (produto.atributos ?? []).map((atributo) => ({
    atributo_id: atributo.atributo_id ?? null,
    nomes_atributos: atributo.nome_atributo ?? "",
    limite: atributo.limite ?? null,
    obrigatorio: !!atributo.obrigatorio,
    valores_atributo: (atributo.valores_atributo ?? []).map((valor) => ({
      valor_atributo_id: valor.valor_atributo_id ?? undefined,
      valor: valor.valor ?? "",
      preco: valor.preco ?? "",
      preco_incluido: !!valor.preco_incluido,
    })),
  }));

  // dias_disponiveis do PRODUTO: 1 = domingo ... 7 = sábado (diferente dos
  // horários de funcionamento, onde 1 = segunda). Posição 0 do array = domingo.
  const diasDisponiveis: boolean[] = Array(7).fill(false);
  (produto.dias_disponiveis ?? []).forEach((dia) => {
    const index = Number(dia) - 1;
    if (index >= 0 && index < 7) diasDisponiveis[index] = true;
  });

  return {
    id: produto.id,
    nome: produto.name ?? "",
    slug: produto.slug ?? "",
    descricao: produto.descricao ?? "",
    preco: produto.preco !== undefined ? String(produto.preco) : "",
    categoria_id: produto.categoria_id ? String(produto.categoria_id) : "",
    ativo: !!produto.ativo,
    image: null,
    imageUrl: produto.image ? `${caminhoImagens}/${produto.image}` : null,
    atributos: atributos.length > 0 ? atributos : [atributoVazio()],
    diasDisponiveis,
  };
};

/* ---------- Edição do formulário (sempre imutável) ---------- */

type CampoAtributo = keyof Omit<IAtributo, "valores_atributo">;
type CampoValor = keyof IValorAtributo;

export const atualizarAtributo = <K extends CampoAtributo>(
  form: IProductFormData,
  index: number,
  campo: K,
  valor: IAtributo[K],
): IProductFormData => ({
  ...form,
  atributos: form.atributos.map((attr, i) =>
    i === index ? { ...attr, [campo]: valor } : attr,
  ),
});

export const atualizarValorAtributo = <K extends CampoValor>(
  form: IProductFormData,
  attrIndex: number,
  valIndex: number,
  campo: K,
  valor: IValorAtributo[K],
): IProductFormData => ({
  ...form,
  atributos: form.atributos.map((attr, i) =>
    i === attrIndex
      ? {
          ...attr,
          valores_atributo: attr.valores_atributo.map((v, j) =>
            j === valIndex ? { ...v, [campo]: valor } : v,
          ),
        }
      : attr,
  ),
});

export const adicionarAtributo = (form: IProductFormData): IProductFormData => ({
  ...form,
  atributos: [...form.atributos, atributoVazio()],
});

export const adicionarValorAoAtributo = (
  form: IProductFormData,
  attrIndex: number,
): IProductFormData => ({
  ...form,
  atributos: form.atributos.map((attr, i) =>
    i === attrIndex
      ? { ...attr, valores_atributo: [...attr.valores_atributo, valorVazio()] }
      : attr,
  ),
});

export const removerAtributo = (
  form: IProductFormData,
  attrIndex: number,
): IProductFormData => ({
  ...form,
  atributos: form.atributos.filter((_, i) => i !== attrIndex),
});

export const removerValorAtributo = (
  form: IProductFormData,
  attrIndex: number,
  valIndex: number,
): IProductFormData => ({
  ...form,
  atributos: form.atributos.map((attr, i) =>
    i === attrIndex
      ? { ...attr, valores_atributo: attr.valores_atributo.filter((_, j) => j !== valIndex) }
      : attr,
  ),
});

export const marcarTodosOsDias = (
  form: IProductFormData,
  marcado: boolean,
): IProductFormData => ({ ...form, diasDisponiveis: Array(7).fill(marcado) });

/** Tira opções sem nome e escolhas sem nome (linhas deixadas em branco). */
export const limparOpcoesVazias = (form: IProductFormData): IProductFormData => ({
  ...form,
  atributos: form.atributos
    .filter((attr) => attr.nomes_atributos.trim() !== "")
    .map((attr) => ({
      ...attr,
      valores_atributo: attr.valores_atributo.filter((v) => v.valor.trim() !== ""),
    })),
});

/* ---------- Validação ---------- */

export const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const precoValido = (preco: string) => {
  if (preco.trim() === "") return true;
  const n = Number(preco.replace(",", "."));
  return Number.isFinite(n) && n >= 0;
};

export interface ErroProduto {
  /** Campo com problema (para rolar a tela até ele). */
  campo: "nome" | "slug" | "categoria" | "imagem" | "preco" | "opcoes";
  mensagem: string;
}

/** Primeiro problema do formulário, ou null se dá para salvar. */
export const validarProduto = (
  form: IProductFormData,
  { editando }: { editando: boolean },
): ErroProduto | null => {
  if (!form.nome.trim()) return { campo: "nome", mensagem: "Informe o nome do produto." };
  if (!form.slug.trim()) return { campo: "slug", mensagem: "Informe o link do produto." };
  if (!editando && !SLUG_VALIDO.test(form.slug)) {
    return {
      campo: "slug",
      mensagem: "O link só pode ter letras minúsculas, números e hífens (ex.: bife-acebolado).",
    };
  }
  if (!String(form.categoria_id)) return { campo: "categoria", mensagem: "Escolha a categoria." };
  if (!editando && !form.image) return { campo: "imagem", mensagem: "Envie a foto do produto." };
  if (!precoValido(form.preco)) {
    return { campo: "preco", mensagem: "O preço base precisa ser um número, ex.: 24,90." };
  }

  for (const attr of limparOpcoesVazias(form).atributos) {
    const nome = attr.nomes_atributos.trim();
    if (attr.valores_atributo.length === 0) {
      return { campo: "opcoes", mensagem: `A opção "${nome}" precisa de pelo menos uma escolha.` };
    }
    if (attr.limite !== null && attr.limite !== undefined && attr.limite < 1) {
      return { campo: "opcoes", mensagem: `O máximo de escolhas de "${nome}" precisa ser 1 ou mais.` };
    }
    const precoRuim = attr.valores_atributo.find((v) => !precoValido(v.preco));
    if (precoRuim) {
      return { campo: "opcoes", mensagem: `O preço de "${precoRuim.valor}" precisa ser um número.` };
    }
  }
  return null;
};

/** Tipos e tamanho que a API aceita para a foto. */
export const TIPOS_IMAGEM = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const TAMANHO_MAX_IMAGEM = 5 * 1024 * 1024;

/** Mensagem de erro da foto escolhida, ou null se a API vai aceitar. */
export const validarImagem = (arquivo: { type: string; size: number }): string | null => {
  if (!TIPOS_IMAGEM.includes(arquivo.type)) return "Use uma foto JPG, PNG, WEBP ou GIF.";
  if (arquivo.size > TAMANHO_MAX_IMAGEM) return "A foto pode ter no máximo 5 MB.";
  return null;
};

export const alternarDiaDisponivel = (
  form: IProductFormData,
  index: number,
): IProductFormData => ({
  ...form,
  diasDisponiveis: form.diasDisponiveis.map((marcado, i) =>
    i === index ? !marcado : marcado,
  ),
});

/** Rótulos dos dias do PRODUTO, na ordem da API (posição 0 = domingo). */
export const DIAS_PRODUTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

/** Estado do formulário → corpo multipart enviado para a API. */
export const formularioParaFormData = (original: IProductFormData): FormData => {
  const form = limparOpcoesVazias(original);
  const data = new FormData();
  data.append("id", String(form.id ?? ""));
  data.append("nome", form.nome);
  data.append("slug", form.slug);
  data.append("descricao", form.descricao);
  data.append("preco", form.preco.replace(",", "."));
  data.append("categoria_id", String(form.categoria_id));
  data.append("ativo", form.ativo ? "1" : "0");
  data.append("image_url", form.image ?? "");

  data.append(
    "dias_disponiveis",
    JSON.stringify(
      form.diasDisponiveis
        .map((marcado, i) => (marcado ? i + 1 : null))
        .filter((dia): dia is number => dia !== null),
    ),
  );

  const atributos = form.atributos.map((attr) => ({
    atributo_id: attr.atributo_id ?? null,
    nome_atributo: attr.nomes_atributos,
    limite: attr.limite,
    obrigatorio: attr.obrigatorio,
    valores_atributo: attr.valores_atributo.map((v) => ({
      valor_atributo_id: v.valor_atributo_id ?? null,
      valor: v.valor,
      // Preço em branco = sem acréscimo
      preco: v.preco.trim() === "" ? "0" : v.preco.replace(",", "."),
      preco_incluido: v.preco_incluido ? 1 : 0,
    })),
  }));

  data.append("atributos", JSON.stringify(atributos));

  return data;
};
