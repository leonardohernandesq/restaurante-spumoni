import CategoryScroll from "@/components/CategoryScroll"
import Container from "@/components/Container"
import { HeaderPages } from "@/components/HeaderPages"
import ListProductsItem from "@/components/ListProductsItem"

const listarProdutos = () => {
    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <HeaderPages title="Voltar ao Gestor de Pedidos" />
            <CategoryScroll />

            <section>
                <ListProductsItem />
            </section>
        </Container>
    )
}

export default listarProdutos