import CategoryScroll from "@/components/CategoryScroll"
import { HeaderPages } from "@/components/HeaderPages"
import ListProductsItem from "@/components/ListProductsItem"

const listarProdutos = () => {
    return (
        <main>
            <HeaderPages title="Voltar ao Gestor de Pedidos" />
            <CategoryScroll />

            <section>
                <ListProductsItem />
                <ListProductsItem />
                <ListProductsItem />
                <ListProductsItem />
                <ListProductsItem />
                <ListProductsItem />
            </section>
        </main>
    )
}

export default listarProdutos