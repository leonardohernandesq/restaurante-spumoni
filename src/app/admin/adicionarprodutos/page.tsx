import { HeaderPages } from "@/components/HeaderPages"

const adicionarProdutos = () => {
    return (
        <main>
            <HeaderPages title="Voltar ao Gestor de Pedidos" />

            <section className="relative max-w-full px-7 py-5 gap-1 flex flex-col md:max-w-7xl md:m-auto">
                <div className="flex flex-col">
                    Produto Disponível?
                    <label className="mt-1 inline-flex items-center cursor-pointer w-fit">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-principal-500 peer-focus:ring-2 peer-focus:ring-green-principal-500 transition-all duration-200"></div>
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 -ml-11 transition-all duration-200"></div>
                    </label>
                </div>

                <label className="mt-3" htmlFor="productTitle">Título do produto</label>
                <input className="bg-zinc-100 border border-zinc-200 py-1.5 px-3 outline-0" type="text" name="productTitle" id="productTitle" placeholder="Digite aqui o título do produto" />

                <label className="mt-3" htmlFor="productImage">Imagem do Produto</label>
                <input className="bg-zinc-100 border border-zinc-200 py-1.5 px-3" type="file" name="productImage" id="productImage" />

                <label className="mt-3" htmlFor="productDescription">Descrição do Produto</label>
                <textarea className="bg-zinc-100 border border-zinc-200 py-1.5 px-3 outline-0" name="productDescription" id="productDescription" placeholder="Digite aqui a descrição do produto" />

                <label className="mt-3" htmlFor="productCategory">Categoria</label>
                <select className="bg-zinc-100 border border-zinc-200 py-1.5 px-3 outline-0" name="productCategory" id="productCategory">
                    <option>Opção 1</option>
                    <option>Opção 2</option>
                </select>

                <label className="mt-3" htmlFor="productValue">Valor</label>
                <input type="text" inputMode="numeric" className="bg-zinc-100 border border-zinc-200 py-1.5 px-3 outline-0" name="productValue" id="productValue" placeholder="Ex: 49.90" />


                <div className="grid grid-cols-3 gap-5 items-center mt-2">
                    <div>
                        <label>Tamanhos</label>
                        <select className="bg-zinc-100 border border-zinc-200 py-1.5 px-3 outline-0 w-full" name="productCategory" id="productCategory">
                            <option>Pequena</option>
                            <option>Média</option>
                            <option>Grande</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="productValue">Valor</label>
                        <input type="text" inputMode="numeric" className="bg-zinc-100 border border-zinc-200 py-1.5 px-3 outline-0 w-full" name="productValue" id="productValue" placeholder="Ex: 49.90" />
                    </div>
                    <div>
                        É Valor Adicional?
                        <label className=" mt-1 inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer w-fit" />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-principal-500 peer-focus:ring-2 peer-focus:ring-green-principal-500 transition-all duration-200"></div>
                            <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 -ml-11 transition-all duration-200"></div>
                        </label>
                    </div>
                    <button className="text-2xl font-medium text-white py-2 rounded-xl mt-4 bg-purple-principal-700">
                        Cadastrar
                    </button>

                </div>


            </section>

        </main>
    )
}

export default adicionarProdutos