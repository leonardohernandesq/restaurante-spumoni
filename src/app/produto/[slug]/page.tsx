'use client'

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Container } from "@/components/Container";
import { ButtonCart } from "@/components/ButtonCart";
import { LoadingIcon } from "@/components/LoadingIcon";
import { HeaderPages } from "@/components/HeaderPages";
import { ISingleProductPageProps } from "@/interfaces/ISingleProductPageProps";
import { getProductBySlug } from "@/services/produto";
import { AtributoSelecionado, cartStore } from "@/store/cartStore";

interface ValorAtributo {
    valor_atributo_id: number;
    valor: string;
    preco: string;
    preco_incluido: boolean;
}

interface Atributo {
    atributo_id: number;
    nome_atributo: string;
    limite: number | null;
    obrigatorio: boolean;
    valores_atributo: ValorAtributo[];
}

interface Produto {
    id: number;
    name: string;
    slug: string;
    image: string;
    descricao: string;
    preco: string;
    ativo: number;
    atributos: Atributo[];
}

export default function ProductPage({ params }: ISingleProductPageProps) {
    const { slug } = use(params);
    const { produtos } = cartStore();
    const totalItens = produtos.length;
    const router = useRouter();

    const [quantidade, setQuantidade] = useState(1);
    const [observacoes, setObservacoes] = useState('');
    const [atributosSelecionados, setAtributosSelecionados] = useState<Record<number, number[]>>({});
    const [produto, setProduto] = useState<Produto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data: Produto = await getProductBySlug(slug);
                setProduto(data);
                setLoading(false);
            } catch (err: any) {
                setError(err?.response?.data?.error || 'Erro ao carregar produto');
                setLoading(false);
                router.push('/');
            }
        };

        if (slug) {
            fetchProduct();
        } else {
            setError("Slug não encontrado.");
            setLoading(false);
        }
    }, [slug]);

    const handleAddProduct = () => {
        if (!produto) return;

        // Verificação de atributos obrigatórios
        for (const atributo of produto.atributos) {
            if (atributo.obrigatorio) {
                const selecionados = atributosSelecionados[atributo.atributo_id] || [];
                if (selecionados.length === 0) {
                    toast.error(`O atributo "${atributo.nome_atributo}" é obrigatório. Selecione ao menos uma opção.`);
                    return;
                }
            }
        }

        setLoading(true);

        const atributosFinal: AtributoSelecionado[] = [];
        let precoFinal = parseFloat(produto.preco);

        produto.atributos.forEach((atributo) => {
            const selecionados = atributosSelecionados[atributo.atributo_id] || [];

            selecionados.forEach((valorId) => {
                const valor = atributo.valores_atributo.find((v) => v.valor_atributo_id === valorId);
                if (valor) {
                    atributosFinal.push({
                        nome: atributo.nome_atributo,
                        valor: valor.valor,
                        preco: parseFloat(valor.preco),
                        atributo_id: atributo.atributo_id,
                        valor_atributo_id: valor.valor_atributo_id
                    });

                    if (valor.preco_incluido) {
                        precoFinal = parseFloat(valor.preco);
                    } else {
                        precoFinal += parseFloat(valor.preco);
                    }
                }
            });
        });

        cartStore.getState().adicionarProduto({
            id: produto.id,
            nome: produto.name,
            slug: produto.slug,
            imagem: produto.image,
            preco: precoFinal,
            quantidade,
            observacoes,
            atributos: atributosFinal
        });

        setLoading(false);
        toast.success("Produto adicionado ao carrinho");
        router.push('/');
    };


    if (loading) {
        return (
            <Container styleRow="bg-zinc-50">
                <HeaderPages title="Carregando Produto..." />
                <LoadingIcon color="text-purple-principal-700" />
            </Container>
        );
    }

    if (error || !produto) {
        return (
            <Container styleRow="bg-zinc-50">
                <HeaderPages title="Erro" />
                <section className='py-5 flex justify-center items-center'>
                    <div className="text-lg text-red-500">{error || "Produto não encontrado."}</div>
                </section>
            </Container>
        );
    }


    const handleChangeCheckbox = (atributoId: number, valorId: number, limite: number | null) => {
        const atuais = atributosSelecionados[atributoId] || [];
        const jaSelecionado = atuais.includes(valorId);

        if (!jaSelecionado && limite && atuais.length >= limite) {
            toast.error(`Você só pode selecionar até ${limite} ${limite == 1 ? 'opção' : 'opções'} para este atributo.`);
            return;
        }

        setAtributosSelecionados((prev) => {
            const atuaisInterno = prev[atributoId] || [];
            if (atuaisInterno.includes(valorId)) {
                return {
                    ...prev,
                    [atributoId]: atuaisInterno.filter((id) => id !== valorId),
                };
            } else {
                return {
                    ...prev,
                    [atributoId]: [...atuaisInterno, valorId],
                };
            }
        });
    };

    return (
        <Container styleRow="bg-zinc-50">
            <HeaderPages title={produto.name} />
            <section className='relative py-5 gap-4 flex flex-col mb-24'>
                <Image src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${produto.image}`} alt={produto.name} width={365} height={282} priority />
                <div className="flex justify-between items-center">
                    <h1 className="font-medium text-lg">{produto.name}</h1>
                    <div className="flex items-center justify-center gap-2 text-xs bg-purple-principal-500 text-white px-2 py-0.5 rounded-full">
                        <button className="p-1" onClick={() => setQuantidade(quantidade - 1)} disabled={quantidade <= 1}>
                            <FaMinus />
                        </button>
                        <span>{quantidade}</span>
                        <button className="p-1" onClick={() => setQuantidade(quantidade + 1)}>
                            <FaPlus />
                        </button>
                    </div>
                </div>
                <p>{produto.descricao}</p>
                <div>
                    {produto.atributos.map((atributo) => (
                        <div key={atributo.nome_atributo} className="py-5 flex flex-col items-start">
                            <div className="mb-3">
                                <p className="text-xs text-red-600 m-1">
                                    {atributo.obrigatorio ? 'Obrigatório' : 'Opcional'}
                                    {atributo.limite ? ` • Limite: ${atributo.limite}` : ''}
                                </p>
                                <div className="bg-green-principal-500 text-white py-1 px-3 rounded-full w-fit">
                                    {atributo.nome_atributo}
                                </div>
                            </div>
                            {atributo.valores_atributo.map((atributo_valor) => (
                                <label key={atributo_valor.valor} htmlFor={`${atributo.atributo_id}_${atributo_valor.valor_atributo_id}`} className="py-2 border-b border-zinc-200 w-full flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <p className="font-medium">{atributo_valor.valor}</p>
                                        <span>{!atributo_valor.preco_incluido && '+'} R$ {atributo_valor.preco}</span>
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name={atributo.nome_atributo}
                                            id={`${atributo.atributo_id}_${atributo_valor.valor_atributo_id}`}
                                            checked={atributosSelecionados[atributo.atributo_id]?.includes(atributo_valor.valor_atributo_id) || false}
                                            onChange={() => handleChangeCheckbox(atributo.atributo_id, atributo_valor.valor_atributo_id, atributo.limite)}
                                        />
                                    </div>
                                </label>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="bg-green-principal-500 text-white py-1 px-3 rounded-full w-fit">Observações</div>
                <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="bg-white py-2 px-3 border border-zinc-100 rounded-lg"
                    placeholder="Ex.: Sem maionese, sem salada, etc."
                    rows={2}
                />
            </section>

            <section className='bg-white shadow-2xl fixed bottom-0 left-2/4 -translate-x-2/4 max-w-full w-full px-7 py-5 gap-4 flex flex-col'>
                <ButtonCart onClick={() => handleAddProduct()}>
                    {loading ? <LoadingIcon color="text-white" /> : 'Adicionar'}
                    <p className="flex items-center gap-2">{totalItens} <FiShoppingCart size={14} /></p>
                </ButtonCart>
            </section>
        </Container>
    );
}
