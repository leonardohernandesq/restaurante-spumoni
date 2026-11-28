import { categoriaService } from "@/services/category";
import { achatarProdutos, produtoService } from "@/services/produto";
import HomeClient from "./HomeClient";

// O cardápio muda com o dia da semana: a página é refeita no máximo a cada 60s
export const revalidate = 60;

/** Busca no servidor; se a API falhar, o navegador tenta de novo sozinho. */
const tentar = async <T,>(buscar: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await buscar();
  } catch (error) {
    console.error("Erro ao carregar o cardápio no servidor:", error);
    return undefined;
  }
};

export default async function Home() {
  const [categorias, produtos] = await Promise.all([
    tentar(categoriaService.listar),
    tentar(async () => achatarProdutos(await produtoService.listarCardapio())),
  ]);

  return (
    <HomeClient categoriasIniciais={categorias} produtosIniciais={produtos} />
  );
}
