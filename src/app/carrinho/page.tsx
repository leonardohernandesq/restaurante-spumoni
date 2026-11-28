"use client";

import { useRouter } from "nextjs-toploader/app";
import { BiTrash } from "react-icons/bi";

import { ButtonCart } from "@/components/ButtonCart";
import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useResumoPedido } from "@/hooks/useResumoPedido";
import { cartStore } from "@/store/cartStore";
import { formatCurrencyBRL } from "@/utils/format";
import { calcularTotalItem } from "@/domain/pricing";

const Carrinho = () => {
  const router = useRouter();
  const { produtos, removerProduto, atualizarQuantidade } = cartStore();
  const handleCheckout = () => {
    router.push("/finalizar");
  };

  const { subtotal } = useResumoPedido(produtos, "", "takeaway");

  return (
    <Container styleRow="bg-zinc-100">
      <HeaderPages title="Confira seu Pedido" />
      <main className="relative py-5 gap-4 flex flex-col flex-1 min-h-screen">
        <p className="font-light">
          SEU PEDIDO ({produtos.length} ITEM{produtos.length > 1 && "S"})
        </p>
        {produtos.map((item) => (
          <section
            key={item.itemId}
            className="flex flex-col border-b border-zinc-200 pb-4 gap-1"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">{item.nome}</p>
              </div>
              <p className="font-medium">
                {formatCurrencyBRL(calcularTotalItem({ precoUnitario: item.preco, quantidade: item.quantidade }))}
              </p>
            </div>

            {item.atributos.map((attr, i) => (
              <div key={i} className="text-sm text-zinc-500 italic">
                {attr.nome}: {attr.valor}{" "}
                {attr.preco > 0 && `(${formatCurrencyBRL(attr.preco)})`}
              </div>
            ))}

            {item.observacoes && (
              <div className="text-sm text-zinc-600 italic mt-1">
                Obs: {item.observacoes}
              </div>
            )}

            <section className="flex gap-2 mt-4">
              <QuantityStepper
                value={item.quantidade}
                onChange={(qtd) => atualizarQuantidade(item.itemId, qtd)}
              />
              <button
                className="bg-zinc-200 p-2 rounded-full w-fit cursor-pointer"
                onClick={() => removerProduto(item.itemId)}
              >
                <BiTrash />
              </button>
            </section>
          </section>
        ))}

        <section className="flex justify-between items-center text-zinc-700">
          <p>SUBTOTAL</p>
          <p>{formatCurrencyBRL(subtotal)}</p>
        </section>
      </main>

      <section className="bg-white shadow-2xl fixed bottom-0 left-2/4 -translate-x-2/4 max-w-full w-full px-7 py-5 gap-4 flex flex-col">
        <ButtonCart
          onClick={handleCheckout}
          isDisabled={produtos.length === 0 ? true : false}
        >
          <>
            {produtos.length === 0 ? (
              <p className="ml-auto mr-auto">
                Você não possui produtos no carrinho
              </p>
            ) : (
              <>
                <p>Continuar</p>
                <p>{formatCurrencyBRL(subtotal)}</p>
              </>
            )}
          </>
        </ButtonCart>
      </section>
    </Container>
  );
};

export default Carrinho;
