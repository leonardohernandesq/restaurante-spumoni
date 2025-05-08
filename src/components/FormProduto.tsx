"use client";

import { ChangeEvent } from "react";
import { IProductFormData, IAtributo, IValorAtributo } from "@/interfaces/IProductFormData";
import { ICategory } from "@/interfaces/ICategory";

interface FormProdutoProps {
    formData: IProductFormData;
    categories: ICategory[];
    loading: boolean;
    onChange: (field: string, value: any) => void;
    onAtributoChange: (index: number, field: string, value: any) => void;
    onValorChange: (
        attrIndex: number,
        valIndex: number,
        field: string,
        value: any
    ) => void;
    adicionarAtributo: () => void;
    adicionarValorAoAtributo: (index: number) => void;
    handleDiaDisponivelChange: (index: number) => void;
    onSubmit: () => void;
}

export const FormProduto = ({
    formData,
    categories,
    loading,
    onChange,
    onAtributoChange,
    onValorChange,
    adicionarAtributo,
    adicionarValorAoAtributo,
    handleDiaDisponivelChange,
    onSubmit,
}: FormProdutoProps) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-6"
        >
            <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => onChange("nome", e.target.value)}
                className="input"
            />
            <input
                type="text"
                placeholder="Slug"
                value={formData.slug}
                onChange={(e) => onChange("slug", e.target.value)}
                className="input"
            />
            <textarea
                placeholder="Descrição"
                value={formData.descricao}
                onChange={(e) => onChange("descricao", e.target.value)}
                className="input"
            />
            <input
                type="number"
                placeholder="Preço"
                value={formData.preco}
                onChange={(e) => onChange("preco", e.target.value)}
                className="input"
            />

            <select
                value={formData.categoria_id}
                onChange={(e) => onChange("categoriaId", e.target.value)}
                className="input"
            >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.nome}
                    </option>
                ))}
            </select>

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => onChange("ativo", e.target.checked)}
                />
                Produto ativo
            </label>

            <label htmlFor="imageInput">Imagem do produto</label>
            <input
                id="imageInput"
                type="file"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange("image", e.target.files?.[0] || null)
                }
            />

            <div>
                <h3 className="font-semibold mb-2">Atributos</h3>
                {formData.atributos.map((atributo: IAtributo, i: number) => (
                    <div key={i} className="border p-4 mb-4 rounded">
                        <input
                            type="text"
                            placeholder="Nome do atributo"
                            value={atributo.nomes_atributos}
                            onChange={(e) =>
                                onAtributoChange(i, "nomes_atributos", e.target.value)
                            }
                            className="input mb-2"
                        />

                        {atributo.valores_atributo.map((valor: IValorAtributo, j: number) => (
                            <div key={j} className="grid grid-cols-3 gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Valor"
                                    value={valor.valor}
                                    onChange={(e) =>
                                        onValorChange(i, j, "valor", e.target.value)
                                    }
                                    className="input"
                                />
                                <input
                                    type="number"
                                    placeholder="Preço"
                                    value={valor.preco}
                                    onChange={(e) =>
                                        onValorChange(i, j, "preco", e.target.value)
                                    }
                                    className="input"
                                />
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={valor.preco_incluido}
                                        onChange={(e) =>
                                            onValorChange(i, j, "preco_incluido", e.target.checked)
                                        }
                                    />
                                    Preço incluído
                                </label>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="text-blue-500 text-sm"
                            onClick={() => adicionarValorAoAtributo(i)}
                        >
                            + Adicionar valor
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="text-blue-500"
                    onClick={adicionarAtributo}
                >
                    + Adicionar atributo
                </button>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Dias disponíveis</h3>
                <div className="grid grid-cols-7 gap-2">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                        (dia, index) => (
                            <label key={index} className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={formData.diasDisponiveis[index]}
                                    onChange={() => handleDiaDisponivelChange(index)}
                                />
                                {dia}
                            </label>
                        )
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Salvando..." : "Salvar Produto"}
            </button>
        </form>
    );
};
