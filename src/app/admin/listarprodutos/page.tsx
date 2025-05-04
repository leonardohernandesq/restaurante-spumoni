// app/admin/produtos/page.tsx

import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { CategoryScroll } from "@/components/CategoryScroll";
import { ListProductsItem } from "@/components/ListProductsItem";
import { getAllCategory } from "@/services/category";
import { getAllProducts } from "@/services/produto";
import { IProduct } from "@/interfaces/IProductAll";

// Interface atualizada
interface ICategoryWithProducts {
    id: number;
    category: string;
    slug: string;
    descriptionCategory: string;
    products: IProduct[];
}

const listarProdutos = async () => {
    const categories = await getAllCategory();
    const productsAll: ICategoryWithProducts[] = await getAllProducts();
    console.log(productsAll)

    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <HeaderPages title="Voltar ao Gestor de Pedidos" />
            <CategoryScroll categories={categories} />

            <section className="mt-6">
                {productsAll.map((categoria) => (
                    <div id={categoria.slug} key={categoria.id} className="mb-6 scroll-mt-20">
                        <h2 className="text-xl font-semibold mb-3">{categoria.category}</h2>
                        {categoria.products.length > 0 ? (
                            categoria.products.map((product) => (
                                <ListProductsItem key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm">Nenhum produto nesta categoria.</p>
                        )}
                    </div>
                ))}
            </section>
        </Container>
    );
};

export default listarProdutos;
