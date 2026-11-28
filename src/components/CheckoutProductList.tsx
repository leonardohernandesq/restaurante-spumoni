import type { Pedido } from "@/types/pedido";
import { PedidoItens } from "@/components/pedido/PedidoItens";
import { calcularTotalItem } from "@/domain/pricing";

export const CheckoutProductList = ({
  produtos,
}: {
  produtos: Pedido["produtos"];
}) => (
  <div className="flex flex-col border-t border-zinc-300 px-4 py-2">
    <h2 className="font-bold text-purple-principal-700 text-lg">Produtos</h2>
    {/* No resumo do cliente o preco_base já é o preço unitário final do
        carrinho (com as opções), então o total do prato é preço x quantidade. */}
    <PedidoItens
      itens={(produtos ?? []).map((produto) => ({
        produto,
        total: calcularTotalItem({
          precoUnitario: produto.preco_base,
          quantidade: produto.quantidade,
        }),
      }))}
    />
  </div>
);
