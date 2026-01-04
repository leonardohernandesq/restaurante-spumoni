/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getAllCategory } from "@/services/category";
import { productStore } from "@/store/produtoStore";
import { ICategory } from "@/interfaces/ICategory";
import {
  IProductFormData,
  IAtributo,
  IValorAtributo,
} from "@/interfaces/IProductFormData";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useProductForm = (slugParam?: string) => {
  const { addNewProduct, updateProduct, getProductBySlug, loading } =
    productStore();
  const router = useRouter();

  const [formData, setFormData] = useState<IProductFormData>({
    id: 0,
    nome: "",
    slug: "",
    descricao: "",
    preco: "",
    categoria_id: "",
    ativo: true,
    image: null,
    imageUrl: null,
    atributos: [
      {
        atributo_id: null,
        nomes_atributos: "",
        limite: null,
        obrigatorio: false,
        valores_atributo: [
          {
            valor_atributo_id: null,
            valor: "",
            preco: "",
            preco_incluido: false,
          },
        ],
      },
    ],
    diasDisponiveis: Array(7).fill(false),
  });

  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const load = async () => {
      const categorias = await getAllCategory();
      setCategories(categorias);

      if (slugParam) {
        const data = await getProductBySlug(slugParam);
        console.log("📦 Dados recebidos da API:", data);

        const atributosFormatados: IAtributo[] = Array.isArray(data.atributos)
          ? data.atributos.map(
              (atributo): IAtributo => ({
                atributo_id: atributo.atributo_id ?? null,
                nomes_atributos: atributo.nome_atributo ?? "",
                limite: atributo.limite ?? null,
                obrigatorio: !!atributo.obrigatorio,
                valores_atributo: Array.isArray(atributo.valores_atributo)
                  ? atributo.valores_atributo.map(
                      (valor): IValorAtributo => ({
                        valor_atributo_id: valor.valor_atributo_id ?? undefined,
                        valor: valor.valor ?? "",
                        preco: valor.preco ?? "",
                        preco_incluido: !!valor.preco_incluido,
                      })
                    )
                  : [],
              })
            )
          : [];

        console.log("📅 dias_disponiveis brutos:", data.dias_disponiveis);

        const diasDisponiveis: boolean[] = Array(7).fill(false);
        if (Array.isArray(data.dias_disponiveis)) {
          data.dias_disponiveis.forEach((i: number) => {
            const index = i - 1;
            if (index >= 0 && index < 7) diasDisponiveis[index] = true;
          });
        }

        setFormData({
          id: data.id,
          nome: data.name ?? "",
          slug: data.slug ?? "",
          descricao: data.descricao ?? "",
          preco: data.preco !== undefined ? String(data.preco) : "",
          categoria_id: data.categoria_id ? String(data.categoria_id) : "",
          ativo: !!data.ativo,
          image: null,
          imageUrl: data.image
            ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}/${data.image}`
            : null,
          atributos:
            atributosFormatados.length > 0
              ? atributosFormatados
              : [
                  {
                    atributo_id: null,
                    nomes_atributos: "",
                    limite: null,
                    obrigatorio: false,
                    valores_atributo: [
                      {
                        valor_atributo_id: null,
                        valor: "",
                        preco: "",
                        preco_incluido: false,
                      },
                    ],
                  },
                ],
          diasDisponiveis,
        });
      }
    };

    load();
  }, [slugParam, getProductBySlug]);

  const buildPayload = (): FormData => {
    const form = new FormData();
    console.log("📦 Construindo payload com formData:", formData);
    form.append("id", String(formData.id ?? ""));
    form.append("nome", formData.nome);
    form.append("slug", formData.slug);
    form.append("descricao", formData.descricao);
    form.append("preco", formData.preco);
    form.append("categoria_id", String(formData.categoria_id));
    form.append("ativo", formData.ativo ? "1" : "0");
    form.append("image_url", formData.image ?? "");

    form.append(
      "dias_disponiveis",
      JSON.stringify(
        formData.diasDisponiveis
          .map((val, i) => (val ? i + 1 : null))
          .filter((v): v is number => v !== null)
      )
    );

    const atributos = formData.atributos.map((attr) => ({
      atributo_id: attr.atributo_id ?? null,
      nome_atributo: attr.nomes_atributos,
      limite: attr.limite,
      obrigatorio: attr.obrigatorio,
      valores_atributo: attr.valores_atributo.map((v) => ({
        valor_atributo_id: v.valor_atributo_id ?? null,
        valor: v.valor,
        preco: v.preco,
        preco_incluido: v.preco_incluido ? 1 : 0,
      })),
    }));

    form.append("atributos", JSON.stringify(atributos));

    return form;
  };

  const handleSubmit = async () => {
    const payload = buildPayload();

    try {
      if (slugParam) {
        await updateProduct(slugParam, payload);
      } else {
        await addNewProduct(payload);
      }

      toast.success(
        `Produto ${slugParam ? "editado" : "cadastrado"} com sucesso!!`
      );
      router.push("/admin/listarprodutos");
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      toast.error(
        `Erro ao ${slugParam ? "editar" : "cadastrar"} produto: ${
          error.message || error
        }`
      );
    }
  };

  return {
    formData,
    setFormData,
    categories,
    handleSubmit,
    loading,
  };
};
