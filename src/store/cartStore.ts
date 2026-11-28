import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildCartItemKey } from "@/domain/cart";
import { todaySaoPaulo } from "@/domain/datetime";

import type {
  NovoProdutoCarrinho,
  ProdutoCarrinho,
} from "@/types/carrinho";

export interface CartState {
  produtos: ProdutoCarrinho[];
  isLoading: boolean;

  setLoading: (value: boolean) => void;

  adicionarProduto: (produto: NovoProdutoCarrinho) => void;
  removerProduto: (itemId: string) => void;
  limparCarrinho: () => void;
  atualizarQuantidade: (itemId: string, quantidade: number) => void;
}

/**
 * Versão do formato salvo no localStorage.
 * v2: itens passaram a ser identificados por `itemId` (antes era o `slug`).
 */
const CART_STORAGE_VERSION = 2;

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      produtos: [],
      isLoading: true,

      setLoading: (value) => set({ isLoading: value }),

      adicionarProduto: (novoProduto) => {
        const itemId = buildCartItemKey(
          novoProduto.id,
          novoProduto.atributos.map((a) => a.valor_atributo_id),
          novoProduto.observacoes,
        );

        const { produtos } = get();
        const existente = produtos.find((p) => p.itemId === itemId);

        if (existente) {
          set({
            produtos: produtos.map((p) =>
              p.itemId === itemId
                ? { ...p, quantidade: p.quantidade + novoProduto.quantidade }
                : p,
            ),
          });
          return;
        }

        set({ produtos: [...produtos, { ...novoProduto, itemId }] });
      },

      removerProduto: (itemId) => {
        set((state) => ({
          produtos: state.produtos.filter((p) => p.itemId !== itemId),
        }));
      },

      limparCarrinho: () => set({ produtos: [] }),

      atualizarQuantidade: (itemId, novaQuantidade) => {
        set((state) => ({
          produtos: state.produtos.map((p) =>
            p.itemId === itemId ? { ...p, quantidade: novaQuantidade } : p,
          ),
        }));
      },
    }),
    {
      name: "carrinho-storage",
      version: CART_STORAGE_VERSION,

      // Carrinhos salvos no formato antigo (sem itemId) são descartados.
      // O carrinho já é limpo todo dia, então o impacto é mínimo.
      migrate: (persisted, version) => {
        if (version < CART_STORAGE_VERSION) {
          return { produtos: [] } as unknown as CartState;
        }
        return persisted as CartState;
      },

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // começou a reidratação
        state.setLoading(true);

        if (typeof window !== "undefined") {
          const storedDate = localStorage.getItem("carrinho-storage-date");
          const today = todaySaoPaulo();

          if (storedDate !== today) {
            state.limparCarrinho();
            localStorage.setItem("carrinho-storage-date", today);
          }
        }

        // terminou a reidratação
        state.setLoading(false);
      },
    },
  ),
);
