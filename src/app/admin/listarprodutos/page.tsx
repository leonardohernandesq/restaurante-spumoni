import { Container } from "@/components/Container"
import { HeaderPages } from "@/components/HeaderPages"
import { CategoryScroll } from "@/components/CategoryScroll"
import { ListProductsItem } from "@/components/ListProductsItem"

const listarProdutos = () => {
    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <HeaderPages title="Voltar ao Gestor de Pedidos" />
            <CategoryScroll categories={[]} />

            <section>
                <ListProductsItem />
            </section>
        </Container>
    )
}

export default listarProdutos