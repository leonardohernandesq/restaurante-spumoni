import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AtributoSelecionado {
    nome: string;
    valor: string;
    preco: number;
}

export interface ProdutoCarrinho {
    id: number;
    nome: string;
    slug: string;
    imagem: string;
    quantidade: number;
    preco: number;
    observacoes?: string;
    atributos: AtributoSelecionado[];
}

export interface CartState {
    produtos: ProdutoCarrinho[];
    adicionarProduto: (produto: ProdutoCarrinho) => void;
    removerProduto: (slug: string) => void;
    limparCarrinho: () => void;
    atualizarQuantidade: (slug: string, quantidade: number) => void;
}

export const cartStore = create<CartState>()(
    persist(
        (set, get) => ({
            produtos: [],

            adicionarProduto: (novoProduto) => {
                const { produtos } = get();

                const produtoExistente = produtos.find(p => p.slug === novoProduto.slug);

                if (produtoExistente) {
                    set({
                        produtos: produtos.map(p =>
                            p.slug === novoProduto.slug
                                ? { ...p, quantidade: p.quantidade + novoProduto.quantidade }
                                : p
                        )
                    });
                } else {
                    set({ produtos: [...produtos, novoProduto] });
                }
            },

            removerProduto: (slug) => {
                set((state) => ({
                    produtos: state.produtos.filter((p) => p.slug !== slug),
                }));
            },

            limparCarrinho: () => set({ produtos: [] }),

            atualizarQuantidade: (slug, novaQuantidade) => {
                set((state) => ({
                    produtos: state.produtos.map((p) =>
                        p.slug === slug ? { ...p, quantidade: novaQuantidade } : p
                    ),
                }));
            },
        }),
        {
            name: 'carrinho-storage', // nome no localStorage
        }
    )
);
