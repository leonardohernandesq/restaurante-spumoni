"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { ResumoPedido } from "@/components/ResumoPedido";
import { PedidoResumoHeader } from "@/components/PedidoResumoHeader";
import { CheckoutFormClient } from "@/components/CheckoutFormClient";
import { CheckoutFormEntrega } from "@/components/CheckoutFormEntrega";
import { CheckoutFormPagamento } from "@/components/CheckoutFormPagamento";

const Finalizar = () => {
  const loja =
    "Estrada da Giesteira 65/67, Arruda dos Vinhos, 2630-241, Portugal";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    handleChangeBookingDate,
    onSubmit,
    produtos,
    subtotal,
    taxaEntrega,
    valorFinal,
    enderecoHook,
  } = useCheckout();

  return (
    <Container styleRow="bg-zinc-100">
      <HeaderPages title="Fazer pedido" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <main className="relative py-5 pb-28 gap-4 flex flex-col flex-1 min-h-screen">
          <PedidoResumoHeader
            produtos={produtos.map((produto) => ({
              ...produto,
              id: produto.id,
            }))}
          />

          <CheckoutFormClient register={register} errors={errors} />

          <CheckoutFormEntrega
            watch={watch}
            setValue={setValue}
            handleChangeBookingDate={handleChangeBookingDate}
            enderecoHook={enderecoHook}
            loja={loja}
          />

          <CheckoutFormPagamento watch={watch} setValue={setValue} />

          <ResumoPedido
            produtosLength={produtos.length}
            subtotal={subtotal}
            taxaEntrega={taxaEntrega}
            valorFinal={valorFinal}
          />
        </main>

        <section className="bg-white shadow-2xl fixed bottom-0 left-2/4 -translate-x-2/4 max-w-full w-full px-7 py-5 gap-4 flex flex-col">
          <button
            type="submit"
            className="bg-purple-principal-700 hover:bg-purple-principal-900 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex justify-between items-center"
          >
            <p>FAZER PEDIDO</p>
            <p>R$ {valorFinal}</p>
          </button>
        </section>
      </form>
    </Container>
  );
};

export default Finalizar;
