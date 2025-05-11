'use client';

import { Container } from "@/components/Container";
import { AdminMenu } from "@/components/AdminMenu";
import { ICategory } from "@/interfaces/ICategory";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { categoryStore, TCategory } from "@/store/categoryStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const listarCategorias = () => {
    const { delete: deleteCategory, categories, loading, getAll } = categoryStore();
    const router = useRouter();

    useEffect(() => {
        getAll();
    }, []);

    console.log(categories);

    const handleEdit = (id: number) => {
        router.push(`/admin/editarcategorias/${id}`);
    }

    const handleDelete = (id: number) => {
        deleteCategory({ id });

        toast.success('Categoria deletada com sucesso ')
    }

    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <div className="py-4">
                <AdminMenu title="Listar Categorias" />
            </div>

            <section className="mt-6">
                {categories.map((item: ICategory) => (
                    <div id={item.slug} key={item.id} className="py-6 scroll-mt-20 border-b border-zinc-300 flex">
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <div title='Número de produtos relacionados' className="flex h-6 w-6 items-center justify-center text-white bg-green-principal-700 text-sm">{item.total_produtos}</div>
                                <h2 className="font-bold text-xl text-green-principal-700">{item.nome}</h2>
                            </div>
                            <p>{item.descricao}</p>
                        </div>
                        <div className='flex items-center gap-3 flex-1 pl-6'>
                            <button className='text-yellow-600 p-2 cursor-pointer' onClick={() => handleEdit(item.id)}>
                                <FaPencil />
                            </button>
                            <button className='text-red-600 p-2 cursor-pointer' onClick={() => handleDelete(item.id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </Container>
    );
};

export default listarCategorias;
