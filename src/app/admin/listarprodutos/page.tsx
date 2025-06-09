'use client';

import { useEffect, useState } from 'react';
import { Container } from "@/components/Container";
import { CategoryScroll } from "@/components/CategoryScroll";
import { ListProductsItem } from "@/components/ListProductsItem";
import { getAllCategory } from "@/services/category";
import { AdminMenu } from "@/components/AdminMenu";
import { ICategory } from "@/interfaces/ICategory";
import { productStore } from "@/store/produtoStore";

const ListarProdutos = () => {
    const { products, fetchProducts } = productStore();
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const getAllProduct = 1;
            const cats = await getAllCategory();
            setCategories(cats);
            await fetchProducts(getAllProduct);
        };

        loadData();
    }, [fetchProducts]);

    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <div className="py-4 px-2">
                <AdminMenu title="Gestor de Pedidos" />
            </div>

            <CategoryScroll categories={categories} />

            <section className="mt-6">
                {categories.map((categoria) => {
                    const produtosDaCategoria = products.filter(
                        (p) => p.categoria_id === categoria.id
                    );

                    return (
                        <div id={categoria.slug} key={categoria.id} className="mb-6 scroll-mt-20">
                            <h2 className="text-xl font-semibold mb-3">{categoria.nome}</h2>

                            {produtosDaCategoria.length > 0 ? (
                                produtosDaCategoria.map((product) => (
                                    <ListProductsItem key={product.id} product={product} />
                                ))
                            ) : (
                                <p className="text-zinc-500 text-sm">Nenhum produto nesta categoria.</p>
                            )}
                        </div>
                    );
                })}
            </section>
        </Container>
    );
};

export default ListarProdutos;
