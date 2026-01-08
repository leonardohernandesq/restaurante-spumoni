"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { CategoryScroll } from "@/components/CategoryScroll";
import { ListProductsItem } from "@/components/ListProductsItem";
import { getAllCategory } from "@/services/category";
import { AdminMenu } from "@/components/AdminMenu";
import { ICategory } from "@/interfaces/ICategory";
import { productStore } from "@/store/produtoStore";
import { toast } from "react-toastify";
import Link from "next/link";

const ListarProdutos = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const fetchProducts = productStore((state) => state.fetchProducts);
  const products = productStore((state) => state.products);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await getAllCategory();
        setCategories(cats);
        await fetchProducts(1);
      } catch {
        toast.error("Erro ao carregar dados");
      }
    };

    loadData();
  }, [fetchProducts]);

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
      <div className="py-4 px-2">
        <AdminMenu title="Gestor de Pedidos" />
      </div>

      <CategoryScroll categories={categories} />

      <section className="mt-6 mb-10">
        {categories.map((categoria) => {
          const produtosDaCategoria = products.filter(
            (p) => p.categoria_id === categoria.id
          );

          return (
            <div
              id={categoria.slug}
              key={categoria.id}
              className="mb-6 scroll-mt-20"
            >
              <h2 className="text-xl font-semibold mb-3">{categoria.nome}</h2>

              {produtosDaCategoria.length > 0 ? (
                produtosDaCategoria.map((product) => (
                  <ListProductsItem key={product.id} product={product} />
                ))
              ) : (
                <p className="text-zinc-500 text-sm">
                  Nenhum produto nesta categoria.
                </p>
              )}
            </div>
          );
        })}
      </section>
      <Link
        href="/admin/adicionarprodutos"
        className="bg-green-principal-500 text-white py-2 px-4 rounded"
      >
        Adicionar Produto
      </Link>
    </Container>
  );
};

export default ListarProdutos;
