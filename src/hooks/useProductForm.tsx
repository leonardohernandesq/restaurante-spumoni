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
        imageUrl: null,
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
                    imageUrl: data.image ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}/${data.image}` : null,
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

    const buildPayload = (): any => {
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

        const dias_disponiveis = formData.diasDisponiveis
            .map((isDisponivel, index) => isDisponivel ? index : null)
            .filter((v) => v !== null);

        return {
            id: formData.id,
            nome: formData.nome,
            slug: formData.slug,
            descricao: formData.descricao,
            preco: formData.preco,
            categoria_id: formData.categoria_id,
            ativo: formData.ativo ? 1 : 0,
            atributos: atributosConvertidos,
            dias_disponiveis,
            image_url: formData.imageUrl ?? '',
        };
    };

    const handleSubmit = async () => {
        const payload = buildPayload();

        if (slugParam) {
            await updateProduct(slugParam, payload);
        } else {
            await addNewProduct(payload);
        }

        toast.success(`Produto ${slugParam ? 'editado' : 'cadastrado'} com sucesso!`);
        router.push('/admin/listarprodutos');
    };

    return {
        formData,
        setFormData,
        categories,
        handleSubmit,
        loading,
    };
};
