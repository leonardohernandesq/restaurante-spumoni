'use client'

import { useState } from "react";
import { HeaderPages } from "@/components/header-pages";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface ProductPageProps {
    params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
    const router = useRouter();
    const [quantidade, setQuantidade] = useState(1);
    const [produto] = useState({
        id: 1,
        name: 'Quarta-feira - Feijoada',
        slug: 'feijoada',
        image: 'prato.png',
        descricao: 'Suculento bife acebolado grelhado na chapa, acompanhado de arroz soltinho, feijão caseiro temperado na medida certa, crocantes batatas fritas douradas e salada fresca com alface e legumes selecionados.',
        preco: '29,90',
        ativo: 1,
        atributos: [
            {
                nomes_atributos: 'Tamanho',
                valores_atributo: [
                    {
                        valor: 'P',
                        preco: '10',
                        preco_incluido: 1
                    },
                    {
                        valor: 'M',
                        preco: '20',
                        preco_incluido: 1
                    },
                ]
            },
            {
                nomes_atributos: 'Vai precisar de talheres?',
                valores_atributo: [
                    {
                        valor: 'Sim',
                        preco: '2',
                        preco_incluido: 0
                    },
                    {
                        valor: 'Não',
                        preco: '0',
                        preco_incluido: 0
                    },
                ]
            },
        ]
    });

    const handleAddProduct = () => {
        alert('Adicionando produto no carrinho');

        router.push('/')
    }

    return (
        <main>
            <HeaderPages title={produto.name} />
            <section className='relative max-w-full px-7 py-5 gap-4 flex flex-col md:max-w-7xl md:m-auto bg-zinc-50'>
                <Image src={`/${produto.image}`} alt={produto.name} width={365} height={282} />
                {params.slug};
                <div className="flex justify-between items-center">
                    <h1 className="font-medium text-lg">{produto.name}</h1>
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
                    {produto.descricao}
                </p>
                <div>
                    {
                        produto.atributos.map((atributo) => (
                            <div key={atributo.nomes_atributos} className="py-5 flex flex-col items-start">
                                <div className="bg-green-principal-500 text-white py-1 px-3 rounded-full mb-3">{atributo.nomes_atributos}</div>
                                {
                                    atributo.valores_atributo.map((atributo_valor) => (
                                        <label key={atributo_valor.valor} htmlFor={atributo_valor.valor} className="py-2 border-b border-zinc-200 w-full flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <p className="font-medium">{atributo_valor.valor}</p>
                                                <span className="">R$ {atributo_valor.preco_incluido}</span>
                                            </div>
                                            <div>
                                                <input type="radio" name={atributo.nomes_atributos} id={atributo_valor.valor} />
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
            <section className="flex gap-3 bg-white p-5 justify-center relative z-20 shadow-md shadow-zinc-900">
                <button className="bg-purple-principal-500 text-white py-2 px-4 flex items-center gap-2 rounded-lg" onClick={() => handleAddProduct()}><FiShoppingCart size={14} /> Adicionar</button>
            </section>
        </main>
    );
}