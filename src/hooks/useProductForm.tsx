import { useState, useEffect } from "react";
import { getAllCategory } from "@/services/category";
import { productStore } from "@/store/produtoStore";
import { ICategory } from "@/interfaces/ICategory";
import { IProductFormData, IAtributo, IValorAtributo } from "@/interfaces/IProductFormData";

export const useProductForm = (slugParam?: string) => {
    const { addNewProduct, updateProduct, getProductBySlug, loading } = productStore();

    const [formData, setFormData] = useState<IProductFormData>({
        nome: '',
        slug: '',
        descricao: '',
        preco: '',
        categoria_id: '',
        ativo: true,
        image: null,
        imageUrl: null,
        atributos: [{
            nomes_atributos: '',
            valores_atributo: [{ valor: '', preco: '', preco_incluido: false }]
        }],
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
                    ? data.atributos.map((atributo: any): IAtributo => ({
                        nomes_atributos: atributo.nome_atributo ?? '',
                        valores_atributo: Array.isArray(atributo.valores_atributo)
                            ? atributo.valores_atributo.map((valor: any): IValorAtributo => ({
                                valor: valor.valor ?? '',
                                preco: valor.preco ?? '',
                                preco_incluido: !!valor.preco_incluido,
                            }))
                            : [],
                    }))
                    : [];

                const diasDisponiveis: boolean[] = Array(7).fill(false);
                if (Array.isArray(data.dias_disponiveis)) {
                    data.dias_disponiveis.forEach((i: number) => {
                        if (i >= 0 && i < 7) diasDisponiveis[i] = true;
                    });
                }

                setFormData({
                    nome: data.name ?? '',
                    slug: data.slug ?? '',
                    descricao: data.descricao ?? '',
                    preco: data.preco !== undefined ? String(data.preco) : '',
                    categoria_id: data.categoria_id ? String(data.categoria_id) : '',
                    ativo: !!data.ativo,
                    image: null,
                    imageUrl: data.image ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}/${data.image}` : null,
                    atributos: atributosFormatados.length > 0 ? atributosFormatados : [{
                        nomes_atributos: '',
                        valores_atributo: [{ valor: '', preco: '', preco_incluido: false }]
                    }],
                    diasDisponiveis,
                });
            }
        };

        load();
    }, [slugParam]);

    const buildFormData = (data: IProductFormData) => {
        const formData = new FormData();
        formData.append('nome', data.nome);
        formData.append('slug', data.slug);
        formData.append('descricao', data.descricao);
        formData.append('preco', data.preco);
        formData.append('categoria_id', String(data.categoria_id));
        formData.append('ativo', data.ativo ? '1' : '0');

        if (data.image) {
            formData.append('image_url', data.image, data.image.name);
        }

        data.atributos.forEach((atributo, i) => {
            formData.append(`atributos[${i}][nomes_atributos]`, atributo.nomes_atributos);
            atributo.valores_atributo.forEach((valor, j) => {
                formData.append(`atributos[${i}][valores_atributo][${j}][valor]`, valor.valor);
                formData.append(`atributos[${i}][valores_atributo][${j}][preco]`, valor.preco);
                formData.append(`atributos[${i}][valores_atributo][${j}][preco_incluido]`, valor.preco_incluido ? '1' : '0');
            });
        });

        data.diasDisponiveis.forEach((disponivel, i) => {
            if (disponivel) {
                formData.append(`dias_disponiveis[${i}]`, String(i));
            }
        });

        return formData;
    };

    const handleSubmit = async () => {
        const form = buildFormData(formData);
        if (slugParam) {
            await updateProduct(slugParam, form);
        } else {
            await addNewProduct(form);
        }
    };

    return {
        formData,
        setFormData,
        categories,
        handleSubmit,
        loading
    };
};
