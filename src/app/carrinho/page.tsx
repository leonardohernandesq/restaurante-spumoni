"use client";

import { useRouter } from "next/navigation";
import { BiTrash } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa6";

import { ButtonCart } from "@/components/ButtonCart";
import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { cartStore, ProdutoCarrinho } from "@/store/cartStore";
import { formatCurrencyBRL } from "@/utils/validators";

const Carrinho = () => {
  const router = useRouter();
  const { produtos, removerProduto, atualizarQuantidade } = cartStore();

  const handleCheckout = () => {
    router.push("/finalizar");
  };

  const handleMinusQuantity = (item: ProdutoCarrinho) => {
    if (item.quantidade > 1) {
      atualizarQuantidade(item.slug, item.quantidade - 1);
    }
  };

  const handlePlusQuantity = (item: ProdutoCarrinho) => {
    if (item.quantidade > 0) {
      atualizarQuantidade(item.slug, item.quantidade + 1);
    }
  };

  const subtotal = produtos.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <Container styleRow="bg-zinc-100">
      <HeaderPages title="Confira seu Pedido" />
      <main className="relative py-5 gap-4 flex flex-col flex-1 min-h-screen">
        <p className="font-light">
          SEU PEDIDO ({produtos.length} ITEM{produtos.length > 1 && "S"})
        </p>
        {produtos.map((item, index) => (
          <section
            key={index}
            className="flex flex-col border-b border-zinc-200 pb-4 gap-1"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">{item.nome}</p>
              </div>
              <p className="font-medium">
                {formatCurrencyBRL(item.preco * item.quantidade)}
              </p>
            </div>
            <p className="text-sm">{item?.observacoes}</p>

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
              <div className="flex items-center justify-center gap-2 text-xs bg-purple-principal-500 text-white px-2 py-0.5 rounded-full w-fit">
                <button
                  className="p-1"
                  onClick={() => handleMinusQuantity(item)}
                >
                  <FaMinus />
                </button>
                <span>{item.quantidade}</span>
                <button
                  className="p-1"
                  onClick={() => handlePlusQuantity(item)}
                >
                  <FaPlus />
                </button>
              </div>
              <button
                className="bg-zinc-200 p-2 rounded-full w-fit"
                onClick={() => removerProduto(item.slug)}
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
