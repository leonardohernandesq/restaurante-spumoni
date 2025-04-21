'use client'

import { use, useEffect, useState } from "react";
import { HeaderPages } from "@/components/HeaderPages";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import ButtonCart from "@/components/ButtonCart";
import { getProductBySlug } from "@/services/produto";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { slug } = use(params);
    const router = useRouter();
    const [quantidade, setQuantidade] = useState(1);
    const [produto, setProduto] = useState<any>(null);  // Definir o tipo corretamente de acordo com a sua resposta
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductBySlug(slug);
                setProduto(data);
                setLoading(false);
            } catch (err: any) {
                setError(err?.response?.data?.error || 'Erro ao carregar produto');
                setLoading(false);
                router.push('/');
            }
        };

        if (slug) {
            fetchProduct();  // Só chama a função se o slug não for vazio
        } else {
            setError("Slug não encontrado.");
            setLoading(false);
        }
    }, [slug]);

    const handleAddProduct = () => {
        alert('Adicionando produto no carrinho');
        router.push('/');
    }

    if (loading) {
        return (
            <Container styleRow="bg-zinc-50">
                <HeaderPages title="Carregando Produto..." />
                <section className='py-5 flex justify-center items-center'>
                    <div className="text-lg text-gray-500">Carregando...</div>
                </section>
            </Container>
        );
    }

    if (error) {
        return (
            <Container styleRow="bg-zinc-50">
                <HeaderPages title="Erro" />
                <section className='py-5 flex justify-center items-center'>
                    <div className="text-lg text-red-500">{error}</div>
                </section>
            </Container>
        );
    }

    return (
        <Container styleRow="bg-zinc-50">
            <HeaderPages title={produto?.name} />
            <section className='relative py-5 gap-4 flex flex-col mb-24'>
                <Image src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${produto?.image}`} alt={produto?.name} width={365} height={282} priority />
                <div className="flex justify-between items-center">
                    <h1 className="font-medium text-lg">{produto?.name}</h1>
                    <div className="flex items-center justify-center gap-2 text-xs bg-purple-principal-500 text-white px-2 py-0.5 rounded-full">
                        <button className="p-1" onClick={() => setQuantidade(quantidade - 1)}>
                            <FaMinus />
                        </button>
                        <span>{quantidade}</span>
                        <button className="p-1" onClick={() => setQuantidade(quantidade + 1)}>
                            <FaPlus />
                        </button>
                    </div>
                </div>
                <p>
                    {produto?.descricao}
                </p>
                <div>
                    {
                        produto?.atributos?.map((atributo: any) => (
                            <div key={atributo?.nomes_atributos} className="py-5 flex flex-col items-start">
                                <div className="bg-green-principal-500 text-white py-1 px-3 rounded-full mb-3">{atributo?.nomes_atributos}</div>
                                {
                                    atributo?.valores_atributo.map((atributo_valor: any) => (
                                        <label key={atributo_valor?.valor} htmlFor={atributo_valor?.valor} className="py-2 border-b border-zinc-200 w-full flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <p className="font-medium">{atributo_valor?.valor}</p>
                                                <span className="">{!atributo_valor?.preco_incluido && '+'} R$ {atributo_valor?.preco}</span>
                                            </div>
                                            <div>
                                                <input type="radio" name={atributo?.nomes_atributos} id={atributo_valor?.valor} />
                                            </div>
                                        </label>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>

                <div className="bg-green-principal-500 text-white py-1 px-3 rounded-full w-fit">Observações</div>
                <textarea className="bg-white py-2 px-3 border border-zinc-100 rounded-lg" placeholder="Ex.: Sem maionese, sem salada, etc." rows={2} />
            </section>
            <section className='bg-white shadow-2xl fixed bottom-0 left-2/4 -translate-x-2/4 max-w-full w-full px-7 py-5 gap-4 flex flex-col'>
                <ButtonCart onClick={() => handleAddProduct()}>Adicionar<p className="flex items-center gap-2">4 <FiShoppingCart size={14} /></p> </ButtonCart>
            </section>
        </Container>
    );
}
