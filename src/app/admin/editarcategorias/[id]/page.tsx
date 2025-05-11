'use client';

import { useRouter, useParams } from "next/navigation";
import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { categoryStore } from "@/store/categoryStore";
import { useEffect } from "react";
import { LoadingIcon } from "@/components/LoadingIcon";
import { toast } from "react-toastify";

export default function EditarCategorias() {
    const params = useParams();
    const id = parseInt(params.id as string);

    const { getCatById, loading, error, update, category, setCategory } = categoryStore();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            getCatById({ id });
        }
    }, [])

    const handleSubmit = () => {
        if (!category) return;
        try {
            update({
                id: category.id,
                nome: category.nome,
                descricao: category.descricao
            });

            toast.success('Categoria atualizada com sucesso')
            router.push("/admin/listarcategorias");
        } catch (error) {
            toast.error('Erro ao atualizar a categoria')
        }
    };


    loading && (
        <LoadingIcon color="text-purple-principal-700" />
    );

    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <HeaderPages title="Voltar ao Gestor de Pedidos" />
            <section className="relative py-5 gap-1 flex flex-col">

                <label className="mt-3">Título do Categoria</label>
                <input value={category?.nome || ''} onChange={(e) => { setCategory({ nome: e.target.value }) }} className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" placeholder="Digite aqui o título do Categoria" />

                <label className="mt-3">Slug do Categoria</label>
                <input disabled value={category?.slug || ''} onChange={() => { }} className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 disabled:opacity-50 disabled:cursor-no-drop" placeholder="Digite aqui o slug do Categoria" />

                <label className="mt-3">Descrição do Categoria</label>
                <textarea value={category?.descricao || ''} onChange={(e) => { setCategory({ descricao: e.target.value }) }} className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" placeholder="Digite aqui a descrição do Categoria" />

                <button
                    onClick={handleSubmit}
                    className="text-2xl font-medium text-white py-2 rounded-xl mt-4 bg-purple-principal-700 cursor-pointer"
                >
                    {loading ? "Salvando..." : "Atualizar"}
                </button>
            </section>
        </Container>
    );
}
