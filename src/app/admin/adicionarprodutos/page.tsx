import { Container } from "@/components/Container"
import { HeaderPages } from "@/components/HeaderPages"
import { ICategory } from "@/interfaces/ICategory";
import { getAllCategory } from "@/services/category"

const adicionarProdutos = async ({ slug }: { slug: string | null }) => {
    const categories = await getAllCategory();
    console.log(categories);
    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <HeaderPages title="Voltar ao Gestor de Pedidos" />
            <section className="relative py-5 gap-1 flex flex-col">
                <div className="flex flex-col">
                    Produto Disponível?
                    <label className="mt-1 inline-flex items-center cursor-pointer w-fit">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-principal-500 peer-focus:ring-2 peer-focus:ring-green-principal-500 transition-all duration-200"></div>
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 -ml-11 transition-all duration-200"></div>
                    </label>
                </div>
                <label className="mt-3" htmlFor="productTitle">Título do produto</label>
                <input className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" type="text" name="productTitle" id="productTitle" placeholder="Digite aqui o título do produto" />
                <label className="mt-3" htmlFor="productImage">Imagem do Produto</label>
                <label htmlFor="File" className="block rounded border w-fit cursor-pointer border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6">
                    <div className="flex items-center justify-center gap-4 w-fit">
                        <span className="font-medium"> Foto do Produto </span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                            />
                        </svg>
                    </div>

                    <input multiple type="file" id="File" className="sr-only" />
                </label>                <label className="mt-3" htmlFor="productDescription">Descrição do Produto</label>
                <textarea className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" name="productDescription" id="productDescription" placeholder="Digite aqui a descrição do produto" />
                <label className="mt-3" htmlFor="productCategory">Categoria</label>
                <select className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" name="productCategory" id="productCategory">
                    <option value={''} disabled>-- Selecione uma categoria --</option>
                    {categories.map((category: ICategory) => (
                        <option key={category.id}>{category.nome}</option>
                    ))}
                </select>
                <label className="mt-3" htmlFor="productValue">Valor</label>
                <input type="text" inputMode="numeric" className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0" name="productValue" id="productValue" placeholder="Ex: 49.90" />
                <div className="grid grid-cols-3 gap-5 items-center mt-2">
                    <div>
                        <label>Tamanhos</label>
                        <select className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 w-full" name="productCategory" id="productCategory">
                            <option>Pequena</option>
                            <option>Média</option>
                            <option>Grande</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="productValue">Valor</label>
                        <input type="text" inputMode="numeric" className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 w-full" name="productValue" id="productValue" placeholder="Ex: 49.90" />
                    </div>
                    <div className="flex items-center gap-4 mt-5">
                        É Valor Adicional?
                        <label className=" mt-1 inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer w-fit" />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-principal-500 peer-focus:ring-2 peer-focus:ring-green-principal-500 transition-all duration-200"></div>
                            <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 -ml-11 transition-all duration-200"></div>
                        </label>
                    </div>
                    <button className="text-2xl font-medium text-white py-2 rounded-xl mt-4 bg-purple-principal-700 cursor-pointer">
                        Cadastrar
                    </button>
                </div>
            </section>
        </Container>
    )
}

export default adicionarProdutos