import { useState, useEffect } from "react";
import { getAllCategory } from "@/services/category";
import { productStore } from "@/store/produtoStore";
import { ICategory } from "@/interfaces/ICategory";
import { IProductFormData, IAtributo, IValorAtributo } from "@/interfaces/IProductFormData";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useProductForm = (slugParam?: string) => {
    const { addNewProduct, updateProduct, getProductBySlug, loading } = productStore();
    const router = useRouter();

    const [formData, setFormData] = useState<IProductFormData>({
        id: 0,
        nome: '',
        slug: '',
        descricao: '',
        preco: '',
        categoria_id: '',
        ativo: true,
        image: null,
        image_url: null,
        atributos: [{
            atributo_id: '',
            nomes_atributos: '',
            limite: null,
            obrigatorio: false,
            valores_atributo: [
                { valor_atributo_id: '', valor: '', preco: '', preco_incluido: false }
            ]
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
                        atributo_id: atributo.atributo_id ?? '',
                        nomes_atributos: atributo.nome_atributo ?? '',
                        limite: atributo.limite ?? null,
                        obrigatorio: !!atributo.obrigatorio,
                        valores_atributo: Array.isArray(atributo.valores_atributo)
                            ? atributo.valores_atributo.map((valor: any): IValorAtributo => ({
                                valor_atributo_id: valor.valor_atributo_id ?? '',
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
                    id: data.id,
                    nome: data.name ?? '',
                    slug: data.slug ?? '',
                    descricao: data.descricao ?? '',
                    preco: data.preco !== undefined ? String(data.preco) : '',
                    categoria_id: data.categoria_id ? String(data.categoria_id) : '',
                    ativo: !!data.ativo,
                    image: null,
                    image_url: data.image ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}/${data.image}` : null,
                    atributos: atributosFormatados.length > 0 ? atributosFormatados : [{
                        atributo_id: '',
                        nomes_atributos: '',
                        limite: null,
                        obrigatorio: false,
                        valores_atributo: [{ valor_atributo_id: '', valor: '', preco: '', preco_incluido: false }]
                    }],
                    diasDisponiveis,
                });
            }
        };

        load();
    }, [slugParam]);

    const buildPayload = (): FormData => {
        const form = new FormData();

        form.append("id", String(formData.id));
        form.append("nome", formData.nome);
        form.append("slug", formData.slug);
        form.append("descricao", formData.descricao);
        form.append("preco", formData.preco);
        form.append("categoria_id", String(formData.categoria_id));
        form.append("ativo", formData.ativo ? "1" : "0");

        const atributosConvertidos = formData.atributos.map(attr => ({
            atributo_id: attr.atributo_id,
            nome_atributo: attr.nomes_atributos,
            limite: attr.limite ?? null,
            obrigatorio: attr.obrigatorio ?? false,
            valores_atributo: attr.valores_atributo.map(v => ({
                valor_atributo_id: v.valor_atributo_id,
                valor: v.valor,
                preco: v.preco,
                preco_incluido: v.preco_incluido ? 1 : 0,
            })),
        }));

        form.append("atributos", JSON.stringify(atributosConvertidos));

        const dias_disponiveis = formData.diasDisponiveis
            .map((isDisponivel, index) => isDisponivel ? index : null)
            .filter((v) => v !== null);

        form.append("dias_disponiveis", JSON.stringify(dias_disponiveis));

        if (formData.image) {
            form.append("image_url", formData.image);
        }

        return form;
    };


    const handleSubmit = async () => {
        const formDataToSend = buildPayload();

        try {
            if (slugParam) {
                await updateProduct(slugParam, formDataToSend);
            } else {
                await addNewProduct(formDataToSend);
            }

            toast.success(`Produto ${slugParam ? 'editado' : 'cadastrado'} com sucesso!`);
            router.push('/admin/listarprodutos');
        } catch (err) {
            console.error("Erro ao enviar:", err);
            toast.error("Erro ao salvar o produto");
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
