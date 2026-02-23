"use client";

import { AdminMenu } from "@/components/AdminMenu";
import { Container } from "@/components/Container";
import { ICategory } from "@/interfaces/ICategory";
import { categoryStore } from "@/store/categoryStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const AdicionarCategorias = () => {
  const { create } = categoryStore();
  const router = useRouter();

  const [category, setCategory] = useState<ICategory>({
    id: 0,
    nome: "",
    slug: "",
    descricao: "",
  });

  const handleSubmit = async (data: ICategory) => {
    try {
      await create(data);

      toast.success("Categoria criada com sucesso!");
      router.push("/admin/listarcategorias");
    } catch (err) {
      console.error("Erro: ", err);
    }
  };

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
      <div className="py-4">
        <AdminMenu title="Adicionar Categorias" />
      </div>
      <section className="relative py-5 gap-1 flex flex-col">
        <label className="mt-3" htmlFor="categoryTitle">
          Nome da categoria
        </label>
        <input
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
          value={category.nome}
          onChange={(e) => setCategory({ ...category, nome: e.target.value })}
          name="categoryTitle"
          id="categoryTitle"
          placeholder="Digite aqui o título do categoria"
        />
        <label className="mt-3" htmlFor="categorySlug">
          Slug da categoria
        </label>
        <input
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
          value={category.slug}
          onChange={(e) => setCategory({ ...category, slug: e.target.value })}
          name="categorySlug"
          id="categorySlug"
          placeholder="Digite aqui o slug do categoria"
        />
        <label className="mt-3" htmlFor="categoryDescription">
          Descrição do categoria
        </label>
        <textarea
          className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
          value={category.descricao}
          onChange={(e) =>
            setCategory({ ...category, descricao: e.target.value })
          }
          name="categoryDescription"
          id="categoryDescription"
          placeholder="Digite aqui a descrição do categoria"
        />

        <button
          onClick={() => handleSubmit(category)}
          className="w-fit px-8 font-medium text-white py-2 rounded-md mt-4 bg-purple-principal-700 cursor-pointer"
        >
          CADASTRAR CATEGORIA
        </button>
      </section>
    </Container>
  );
};

export default AdicionarCategorias;
