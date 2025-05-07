'use client';

import { useState, useEffect } from "react";
import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { PreviewImage } from "@/components/PreviewImage";
import { ICategory } from "@/interfaces/ICategory";
import { getAllCategory } from "@/services/category";
import { productStore } from "@/store/produtoStore";
import { useRouter } from "next/navigation";

const AdicionarProdutos = () => {
    const [nome, setNome] = useState('');
    const [slug, setSlug] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [atributos, setAtributos] = useState([
        { nomes_atributos: '', valores_atributo: [{ valor: '', preco: '', preco_incluido: false }] }
    ]);
    const [diasDisponiveis, setDiasDisponiveis] = useState<boolean[]>(Array(7).fill(false));

    const router = useRouter();

    const { addNewProduct, loading, deleteProductApi } = productStore();

    useEffect(() => {
        const loadCategories = async () => {
            const result = await getAllCategory();
            setCategories(result);
        };

        loadCategories();
    }, []);

    const adicionarAtributo = () => {
        setAtributos([...atributos, { nomes_atributos: '', valores_atributo: [{ valor: '', preco: '', preco_incluido: false }] }]);
    };

    const adicionarValorAoAtributo = (index: number) => {
        const novosAtributos = [...atributos];
        novosAtributos[index].valores_atributo.push({ valor: '', preco: '', preco_incluido: false });
        setAtributos(novosAtributos);
    };

    const handleDiaDisponivelChange = (index: number) => {
        const novosDias = [...diasDisponiveis];
        novosDias[index] = !novosDias[index];
        setDiasDisponiveis(novosDias);
    };

    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('slug', slug);
        formData.append('descricao', descricao);
        formData.append('preco', preco);
        formData.append('categoria_id', categoriaId);
        formData.append('ativo', ativo ? '1' : '0');

        if (image) {
            formData.append('image_url', image, image.name);
        }

        atributos.forEach((atributo, i) => {
            formData.append(`atributos[${i}][nomes_atributos]`, atributo.nomes_atributos);
            atributo.valores_atributo.forEach((valorObj, j) => {
                formData.append(`atributos[${i}][valores_atributo][${j}][valor]`, valorObj.valor);
                formData.append(`atributos[${i}][valores_atributo][${j}][preco]`, valorObj.preco);
                formData.append(`atributos[${i}][valores_atributo][${j}][preco_incluido]`, valorObj.preco_incluido ? '1' : '0');
            });
        });

        diasDisponiveis.forEach((disponivel, i) => {
            if (disponivel) formData.append(`dias_disponiveis[${i}]`, String(i));
        });

        try {
            await addNewProduct(formData as any);

            router.push('/admin/listarprodutos')
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        }
    };

    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <HeaderPages title="Voltar ao Gestor de Pedidos" />
            <section className="relative py-5 gap-1 flex flex-col">
                <div className="flex flex-col">
                    Produto Disponível?
                    <label className="mt-1 inline-flex items-center cursor-pointer w-fit">
                        <input type="checkbox" className="sr-only peer" checked={ativo} onChange={() => setAtivo(!ativo)} />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-principal-500 peer-focus:ring-2 peer-focus:ring-green-principal-500 transition-all duration-200"></div>
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 -ml-11 transition-all duration-200"></div>
                    </label>
                </div>

                <label className="mt-3">Título do produto</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" type="text" placeholder="Digite aqui o título do produto" />

                <label className="mt-3">Slug do produto</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" type="text" placeholder="Digite aqui o slug do produto" />

                <label className="mt-3">Imagem do Produto</label>
                <PreviewImage onFileChange={setImage} />

                <label className="mt-3">Descrição do Produto</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" placeholder="Digite aqui a descrição do produto" />

                <label className="mt-3">Categoria</label>
                <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0">
                    <option value="">-- Selecione uma categoria --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={String(category.id)}>{category.nome}</option>
                    ))}
                </select>

                <label className="mt-3">Valor Padrão</label>
                <input value={preco} onChange={(e) => setPreco(e.target.value)} type="text" inputMode="numeric" className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" placeholder="Ex: 49.90" />

                <h3 className="mt-4 font-semibold">Atributos</h3>
                <div className="grid grid-cols-3 gap-5">
                    {atributos.map((atributo, i) => (
                        <div key={i} className="bg-zinc-200 border border-zinc-300 p-3 my-2">
                            <input
                                type="text"
                                placeholder="Nome do atributo"
                                value={atributo.nomes_atributos}
                                onChange={(e) => {
                                    const novos = [...atributos];
                                    novos[i].nomes_atributos = e.target.value;
                                    setAtributos(novos);
                                }}
                                className="w-full mb-2 border border-zinc-400 p-2 outline-0 rounded-md text-sm"
                            />
                            {atributo.valores_atributo.map((valor, j) => (
                                <div key={j} className="grid grid-cols-3 gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Valor atributo"
                                        value={valor.valor}
                                        onChange={(e) => {
                                            const novos = [...atributos];
                                            novos[i].valores_atributo[j].valor = e.target.value;
                                            setAtributos(novos);
                                        }}
                                        className="border border-zinc-400 p-2 outline-0 rounded-md text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Preço"
                                        value={valor.preco}
                                        onChange={(e) => {
                                            const novos = [...atributos];
                                            novos[i].valores_atributo[j].preco = e.target.value;
                                            setAtributos(novos);
                                        }}
                                        className="border border-zinc-400 p-2 outline-0 rounded-md text-sm"
                                    />
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={valor.preco_incluido}
                                            onChange={(e) => {
                                                const novos = [...atributos];
                                                novos[i].valores_atributo[j].preco_incluido = e.target.checked;
                                                setAtributos(novos);
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-1 text-sm">Preço incluído?</span>
                                    </label>
                                </div>
                            ))}
                            <button type="button" onClick={() => adicionarValorAoAtributo(i)} className="text-sm text-white cursor-pointer bg-purple-principal-700 p-2 rounded-md">
                                + Adicionar valor
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={adicionarAtributo} className="mt-2 text-green-principal-700 text-lg font-semibold cursor-pointer">
                    + Adicionar novo atributo
                </button>

                <h3 className="mt-4 font-semibold">Dias disponíveis</h3>
                <div className="flex justify-between text-lg">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, i) => (
                        <label key={i} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={diasDisponiveis[i]}
                                onChange={() => handleDiaDisponivelChange(i)}
                                className="h-4 w-4"
                            />
                            <span>{dia}</span>
                        </label>
                    ))}
                </div>

                <button onClick={handleAddProduct} className="text-2xl font-medium text-white py-2 rounded-xl mt-4 bg-purple-principal-700 cursor-pointer">
                    {loading ? "Salvando..." : "Cadastrar"}
                </button>
            </section>
        </Container>
    );
};

export default AdicionarProdutos;
