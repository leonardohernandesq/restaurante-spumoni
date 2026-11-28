import { describe, expect, it } from "vitest";
import {
  DIAS_PRODUTO,
  adicionarAtributo,
  adicionarValorAoAtributo,
  alternarDiaDisponivel,
  atualizarAtributo,
  atualizarValorAtributo,
  formularioParaFormData,
  formularioVazio,
  limparOpcoesVazias,
  marcarTodosOsDias,
  produtoParaFormulario,
  removerAtributo,
  removerValorAtributo,
  validarImagem,
  validarProduto,
} from "./produtoForm";
import type { Produto } from "@/types/produto";

const produtoApi = {
  id: 70,
  name: "Bife Acebolado (Marmitex)",
  slug: "bife-acebolado-marmitex",
  descricao: "Arroz, feijão...",
  preco: "20.00",
  categoria_id: 3,
  ativo: true,
  image: "bife.jpg",
  dias_disponiveis: [1, 3, 7],
  atributos: [
    {
      atributo_id: 179,
      nome_atributo: "Tamanhos",
      limite: 1,
      obrigatorio: 1,
      valores_atributo: [
        { valor_atributo_id: 411, valor: "Média", preco: "24.00", preco_incluido: true },
      ],
    },
  ],
} as unknown as Produto;

describe("produtoParaFormulario", () => {
  const form = produtoParaFormulario(produtoApi, "https://img");

  it("copia os campos básicos e monta a URL da imagem", () => {
    expect(form).toMatchObject({
      id: 70,
      nome: "Bife Acebolado (Marmitex)",
      preco: "20.00",
      categoria_id: "3",
      ativo: true,
      imageUrl: "https://img/bife.jpg",
    });
  });

  it("converte dias disponíveis (1 = domingo, como na API) em marcações", () => {
    expect(form.diasDisponiveis).toEqual([true, false, true, false, false, false, true]);
  });

  it("converte atributos e valores", () => {
    expect(form.atributos[0]).toMatchObject({
      atributo_id: 179,
      nomes_atributos: "Tamanhos",
      limite: 1,
      obrigatorio: true,
    });
    expect(form.atributos[0].valores_atributo[0]).toMatchObject({
      valor: "Média",
      preco_incluido: true,
    });
  });

  it("produto sem atributos ganha um atributo em branco para editar", () => {
    const semAtributos = produtoParaFormulario({ ...produtoApi, atributos: [] });
    expect(semAtributos.atributos).toHaveLength(1);
    expect(semAtributos.atributos[0].nomes_atributos).toBe("");
  });
});

describe("edição imutável do formulário", () => {
  const base = produtoParaFormulario(produtoApi);

  it("atualizarAtributo muda só o atributo escolhido e não altera o original", () => {
    const novo = atualizarAtributo(base, 0, "nomes_atributos", "Tamanho");
    expect(novo.atributos[0].nomes_atributos).toBe("Tamanho");
    expect(base.atributos[0].nomes_atributos).toBe("Tamanhos");
  });

  it("atualizarValorAtributo muda só o valor escolhido", () => {
    const novo = atualizarValorAtributo(base, 0, 0, "preco", "26.00");
    expect(novo.atributos[0].valores_atributo[0].preco).toBe("26.00");
    expect(base.atributos[0].valores_atributo[0].preco).toBe("24.00");
  });

  it("adiciona atributo e valor sem mexer no estado anterior", () => {
    const comAtributo = adicionarAtributo(base);
    expect(comAtributo.atributos).toHaveLength(2);
    expect(base.atributos).toHaveLength(1);

    const comValor = adicionarValorAoAtributo(base, 0);
    expect(comValor.atributos[0].valores_atributo).toHaveLength(2);
    expect(base.atributos[0].valores_atributo).toHaveLength(1);
  });

  it("produto novo começa disponível em todos os dias", () => {
    expect(formularioVazio().diasDisponiveis).toEqual(Array(7).fill(true));
  });

  it("alternarDiaDisponivel liga e desliga um dia", () => {
    const novo = alternarDiaDisponivel(base, 1);
    expect(novo.diasDisponiveis[1]).toBe(!base.diasDisponiveis[1]);
    expect(alternarDiaDisponivel(novo, 1).diasDisponiveis[1]).toBe(base.diasDisponiveis[1]);
  });

  it("marcarTodosOsDias marca ou desmarca a semana inteira", () => {
    expect(marcarTodosOsDias(base, false).diasDisponiveis).toEqual(Array(7).fill(false));
    expect(marcarTodosOsDias(base, true).diasDisponiveis).toEqual(Array(7).fill(true));
  });

  it("remove opção e escolha sem mexer no original", () => {
    const com2 = adicionarValorAoAtributo(adicionarAtributo(base), 0);
    expect(removerAtributo(com2, 1).atributos).toHaveLength(com2.atributos.length - 1);
    expect(removerValorAtributo(com2, 0, 0).atributos[0].valores_atributo).toHaveLength(
      com2.atributos[0].valores_atributo.length - 1,
    );
    expect(com2.atributos.length).toBeGreaterThan(removerAtributo(com2, 1).atributos.length);
  });

  it("limparOpcoesVazias tira linhas deixadas em branco", () => {
    const form = {
      ...formularioVazio(),
      atributos: [
        { atributo_id: null, nomes_atributos: "  ", limite: null, obrigatorio: false, valores_atributo: [] },
        {
          atributo_id: null,
          nomes_atributos: "Tamanho",
          limite: 1,
          obrigatorio: true,
          valores_atributo: [
            { valor: "P", preco: "20", preco_incluido: true },
            { valor: "", preco: "", preco_incluido: false },
          ],
        },
      ],
    };
    const limpo = limparOpcoesVazias(form);
    expect(limpo.atributos).toHaveLength(1);
    expect(limpo.atributos[0].valores_atributo.map((v) => v.valor)).toEqual(["P"]);
  });

  it("rótulos dos dias começam no domingo (convenção do produto)", () => {
    expect(DIAS_PRODUTO[0]).toBe("Dom");
    expect(DIAS_PRODUTO[3]).toBe("Qua"); // Feijoada = [4, 7] → Qua e Sáb
    expect(DIAS_PRODUTO[6]).toBe("Sáb");
  });
});

describe("formularioParaFormData", () => {
  it("serializa dias e atributos no formato da API", () => {
    const form = produtoParaFormulario(produtoApi);
    const data = formularioParaFormData(form);

    expect(data.get("nome")).toBe("Bife Acebolado (Marmitex)");
    expect(data.get("ativo")).toBe("1");
    expect(JSON.parse(String(data.get("dias_disponiveis")))).toEqual([1, 3, 7]);

    const [atributo] = JSON.parse(String(data.get("atributos")));
    expect(atributo).toMatchObject({ nome_atributo: "Tamanhos", limite: 1 });
    expect(atributo.valores_atributo[0]).toMatchObject({ valor: "Média", preco_incluido: 1 });
  });

  it("formulário vazio vira produto inativo=0 só se desmarcado", () => {
    const data = formularioParaFormData({ ...formularioVazio(), ativo: false });
    expect(data.get("ativo")).toBe("0");
    expect(data.get("dias_disponiveis")).toBe("[1,2,3,4,5,6,7]");
  });

  it("não envia opções em branco, troca vírgula por ponto e preço vazio por 0", () => {
    const form = {
      ...formularioVazio(),
      preco: "24,90",
      atributos: [
        {
          atributo_id: null,
          nomes_atributos: "Adicional",
          limite: null,
          obrigatorio: false,
          valores_atributo: [
            { valor: "Ovo", preco: "", preco_incluido: false },
            { valor: "Bacon", preco: "3,5", preco_incluido: false },
            { valor: "", preco: "", preco_incluido: false },
          ],
        },
        { atributo_id: null, nomes_atributos: "", limite: null, obrigatorio: false, valores_atributo: [] },
      ],
    };
    const data = formularioParaFormData(form);
    expect(data.get("preco")).toBe("24.90");
    const atributos = JSON.parse(String(data.get("atributos")));
    expect(atributos).toHaveLength(1);
    expect(atributos[0].valores_atributo.map((v: { preco: string }) => v.preco)).toEqual(["0", "3.5"]);
  });
});

describe("validarProduto", () => {
  const valido = {
    ...formularioVazio(),
    nome: "Feijoada",
    slug: "feijoada",
    categoria_id: "3",
    preco: "39.90",
    image: new File(["x"], "f.jpg", { type: "image/jpeg" }),
  };

  it("aceita um produto completo", () => {
    expect(validarProduto(valido, { editando: false })).toBeNull();
  });

  it("aponta o primeiro campo com problema", () => {
    expect(validarProduto({ ...valido, nome: " " }, { editando: false })?.campo).toBe("nome");
    expect(validarProduto({ ...valido, slug: "Feijoada Completa" }, { editando: false })?.campo).toBe("slug");
    expect(validarProduto({ ...valido, categoria_id: "" }, { editando: false })?.campo).toBe("categoria");
    expect(validarProduto({ ...valido, image: null }, { editando: false })?.campo).toBe("imagem");
    expect(validarProduto({ ...valido, preco: "abc" }, { editando: false })?.campo).toBe("preco");
  });

  it("na edição a foto e o formato do link antigo não são exigidos", () => {
    expect(validarProduto({ ...valido, image: null, slug: "Link_Antigo" }, { editando: true })).toBeNull();
  });

  it("opção com nome precisa de escolhas", () => {
    const semEscolha = {
      ...valido,
      atributos: [
        { atributo_id: null, nomes_atributos: "Tamanho", limite: 1, obrigatorio: true, valores_atributo: [] },
      ],
    };
    expect(validarProduto(semEscolha, { editando: false })?.mensagem).toContain("Tamanho");
  });
});

describe("validarImagem", () => {
  it("aceita JPG/PNG/WEBP/GIF até 5 MB", () => {
    expect(validarImagem({ type: "image/png", size: 1000 })).toBeNull();
    expect(validarImagem({ type: "image/heic", size: 1000 })).toMatch(/JPG/);
    expect(validarImagem({ type: "image/jpeg", size: 6 * 1024 * 1024 })).toMatch(/5 MB/);
  });
});
