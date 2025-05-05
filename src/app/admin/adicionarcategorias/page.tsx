import { AdminMenu } from "@/components/AdminMenu";
import { Container } from "@/components/Container"

const adicionarcategorias = async ({ slug }: { slug: string | null }) => {
    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <div className="py-4">
                <AdminMenu title="Adicionar Categorias" />
            </div>
            <section className="relative py-5 gap-1 flex flex-col">
                <div className="flex flex-col">
                    Categoria Disponível?
                    <label className="mt-1 inline-flex items-center cursor-pointer w-fit">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-principal-500 peer-focus:ring-2 peer-focus:ring-green-principal-500 transition-all duration-200"></div>
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 -ml-11 transition-all duration-200"></div>
                    </label>
                </div>
                <label className="mt-3" htmlFor="categoryTitle">Nome da categoria</label>
                <input className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" type="text" name="categoryTitle" id="categoryTitle" placeholder="Digite aqui o título do categoria" />
                <label className="mt-3" htmlFor="categoryTitle">Slug da categoria</label>
                <input className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" type="text" name="categoryTitle" id="categoryTitle" placeholder="Digite aqui o slug do categoria" />
                <label className="mt-3" htmlFor="categoryDescription">Descrição do categoria</label>
                <textarea className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" name="categoryDescription" id="categoryDescription" placeholder="Digite aqui a descrição do categoria" />

                <button className="w-fit px-8 font-medium text-white py-2 rounded-md mt-4 bg-purple-principal-700 cursor-pointer">
                    CADASTRAR CATEGORIA
                </button>
            </section>
        </Container>
    )
}

export default adicionarcategorias