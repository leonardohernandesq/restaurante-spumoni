"use client";

import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { PreviewImage } from "@/components/PreviewImage";
import { useProductForm } from "@/hooks/useProductForm";

export default function AdicionarProdutoPage() {
  const { formData, setFormData, categories, handleSubmit, loading } =
    useProductForm(); // sem slug → modo criação

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAtributo = (
    index: number,
    field: string,
    value: string | number | boolean | null
  ) => {
    const novos = [...formData.atributos];
    novos[index] = { ...novos[index], [field]: value };
    setFormData((prev) => ({ ...prev, atributos: novos }));
  };

  const updateValor = (
    attrIndex: number,
    valIndex: number,
    field: string,
    value: string | number | boolean | null
  ) => {
    const novos = [...formData.atributos];
    const valores = [...novos[attrIndex].valores_atributo];
    valores[valIndex] = { ...valores[valIndex], [field]: value };
    novos[attrIndex].valores_atributo = valores;
    setFormData((prev) => ({ ...prev, atributos: novos }));
  };

  const adicionarAtributo = () => {
    setFormData((prev) => ({
      ...prev,
      atributos: [
        ...prev.atributos,
        {
          atributo_id: null,
          nomes_atributos: "",
          limite: null,
          obrigatorio: false,
          valores_atributo: [{ valor: "", preco: "", preco_incluido: false }],
        },
      ],
    }));
  };

  const adicionarValorAoAtributo = (index: number) => {
    const novos = [...formData.atributos];
    novos[index].valores_atributo.push({
      valor: "",
      preco: "",
      preco_incluido: false,
    });
    setFormData((prev) => ({ ...prev, atributos: novos }));
  };

  const handleDiaDisponivelChange = (index: number) => {
    const dias = [...formData.diasDisponiveis];
    dias[index] = !dias[index];
    setFormData((prev) => ({ ...prev, diasDisponiveis: dias }));
  };

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
      <HeaderPages title="Voltar ao Gestor de Produtos" />

      <section className="relative py-5 gap-1 flex flex-col">
        <div className="flex flex-col">
          Produto Disponível?
          <label className="mt-1 inline-flex items-center cursor-pointer w-fit">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={formData.ativo}
              onChange={() => handleChange("ativo", !formData.ativo)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-principal-500 transition-all" />
            <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 -ml-11 transition-all" />
          </label>
        </div>

        <label className="mt-3">
          Título do produto <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Digite aqui o nome do produto"
          value={formData.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
          required
        />

        <label className="mt-3">
          Slug do produto <span className="text-red-500">*</span>
        </label>
        <input
          value={formData.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 disabled:opacity-50 disabled:cursor-no-drop"
          placeholder="Digite aqui o slug do produto"
          required
        />

        <label className="mt-3">
          Imagem do Produto <span className="text-red-500">*</span>
        </label>
        <PreviewImage
          onFileChange={(file) =>
            setFormData((prev) => ({ ...prev, image: file }))
          }
        />

        <label className="mt-3">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
          rows={4}
          placeholder="Digite aqui a descrição do produto"
        />

        <label className="mt-3">
          Categoria <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.categoria_id}
          onChange={(e) => handleChange("categoria_id", e.target.value)}
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
          required
        >
          <option value="">-- Selecione uma categoria --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.nome}
            </option>
          ))}
        </select>

        <label className="mt-3">Preço base</label>
        <input
          type="number"
          value={formData.preco}
          onChange={(e) => handleChange("preco", e.target.value)}
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
          placeholder="Digite aqui o preço do produto sem atributo"
        />

        <h3 className="mt-4 font-semibold">Atributos</h3>
        <div className="grid grid-cols-3 gap-5">
          {formData.atributos.map((atributo, i) => (
            <div
              key={i}
              className="bg-zinc-200 border border-zinc-300 p-3 my-2"
            >
              <input
                className="w-full mb-2 border border-zinc-400 p-2 outline-0 rounded-md text-sm"
                placeholder="Nome do atributo"
                value={atributo.nomes_atributos}
                onChange={(e) =>
                  updateAtributo(i, "nomes_atributos", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Limite"
                  className="border border-zinc-400 p-2 outline-0 rounded-md text-sm"
                  value={atributo.limite ?? ""}
                  onChange={(e) =>
                    updateAtributo(
                      i,
                      "limite",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                />

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={atributo.obrigatorio}
                    onChange={(e) =>
                      updateAtributo(i, "obrigatorio", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm">Obrigatório</span>
                </label>
              </div>

              {atributo.valores_atributo.map((valor, j) => (
                <div key={j} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    className="border border-zinc-400 p-2 outline-0 rounded-md text-sm"
                    placeholder="Valor atributo"
                    value={valor.valor}
                    onChange={(e) => updateValor(i, j, "valor", e.target.value)}
                  />
                  <input
                    type="number"
                    className="border border-zinc-400 p-2 outline-0 rounded-md text-sm"
                    placeholder="Preço"
                    value={valor.preco}
                    onChange={(e) => updateValor(i, j, "preco", e.target.value)}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={valor.preco_incluido}
                      onChange={(e) =>
                        updateValor(i, j, "preco_incluido", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <span className="ml-1 text-sm">Preço incluído?</span>
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={() => adicionarValorAoAtributo(i)}
                className="text-sm text-white cursor-pointer bg-purple-principal-700 p-2 rounded-md"
              >
                + Adicionar valor
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={adicionarAtributo}
          className="mt-2 text-green-principal-700 text-lg font-semibold cursor-pointer"
        >
          + Adicionar novo atributo
        </button>

        <h3 className="mt-4 font-semibold">Dias disponíveis</h3>
        <div className="flex justify-between">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, i) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.diasDisponiveis[i]}
                onChange={() => handleDiaDisponivelChange(i)}
              />
              {dia}
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="text-2xl text-white py-2 rounded-xl mt-4 bg-purple-principal-700"
        >
          {loading ? "Salvando..." : "Criar produto"}
        </button>
      </section>
    </Container>
  );
}
