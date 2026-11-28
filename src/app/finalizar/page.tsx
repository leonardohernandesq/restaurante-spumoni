"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "nextjs-toploader/app";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import { cartStore } from "@/store/cartStore";
import { useCreatePedido } from "@/queries/pedidos";
import { useSettingsQuery } from "@/queries/config";
import { useResumoPedido } from "@/hooks/useResumoPedido";

import { Container } from "@/components/Container";
import { HeaderPages } from "@/components/HeaderPages";
import { ResumoPedido } from "@/components/ResumoPedido";
import { BookingInputs } from "@/components/BookingInputs";
import { EnderecoModal } from "@/components/EnderecoModal";
import { CheckoutButton } from "@/components/CheckoutButton";
import { FormNotaFiscal } from "@/components/FormNotaFiscal";
import { PaymentCheckout } from "@/components/PaymentCheckout";
import { DeliveryOptions } from "@/components/DeliveryOptions";
import { PedidoResumoHeader } from "@/components/PedidoResumoHeader";
import { CheckoutDadosCliente } from "@/components/CheckoutDadosCliente";

import {
  checkoutVazio,
  montarPedidoDto,
  validarCheckout,
  type CheckoutForm,
} from "@/domain/checkout";
import { montarResumoPedido, salvarResumoPedido } from "@/domain/pedidoResumo";
import { toSaoPauloSql } from "@/domain/datetime";

const Finalizar = () => {
  const router = useRouter();
  const createPedido = useCreatePedido();
  const { produtos, limparCarrinho, isLoading: carregandoCarrinho } =
    cartStore();
  const { data: settings } = useSettingsQuery();

  const form = useForm<CheckoutForm>({ defaultValues: checkoutVazio() });
  const [tipoEntrega, cidade, bairro] = useWatch({
    control: form.control,
    name: ["tipoEntrega", "endereco.cidade", "endereco.bairro"],
  });

  const { subtotal, taxaEntrega, valorFinal } = useResumoPedido(
    produtos,
    bairro,
    tipoEntrega,
    cidade,
  );

  const pedidoFinalizadoRef = useRef(false);

  useEffect(() => {
    if (pedidoFinalizadoRef.current) return;

    // Ao recarregar a página, a 1ª renderização ainda não leu o carrinho do
    // localStorage (produtos = []). Sem esperar, o cliente era mandado à home.
    if (carregandoCarrinho) return;

    if (produtos.length === 0) {
      toast.error("Você não possui um produto!");
      router.replace("/");
    }
  }, [produtos, router, carregandoCarrinho]);

  const handleFinish = async (valores: CheckoutForm) => {
    // Evita pedido duplicado por clique duplo
    if (createPedido.isPending) return;

    const erro = validarCheckout(valores);
    if (erro) {
      form.setError(erro.campo, { message: erro.mensagem });
      toast.error(erro.mensagem);
      return;
    }

    const dados = montarPedidoDto(valores, produtos, taxaEntrega, toSaoPauloSql());

    try {
      const pedidoId = await createPedido.mutateAsync(dados);
      pedidoFinalizadoRef.current = true;

      salvarResumoPedido(
        montarResumoPedido(pedidoId, dados, produtos, {
          subtotal,
          taxaEntrega,
          valorFinal,
        }),
      );

      limparCarrinho();
      router.push(`/obrigado?pedido_id=${pedidoId}`);
      toast.success("Pedido enviado com sucesso!");
    } catch {
      toast.error("Erro ao enviar o pedido, tente novamente!");
    }
  };

  return (
    <FormProvider {...form}>
      <Container styleRow="bg-zinc-100">
        <HeaderPages title="Fazer pedido" />
        <main className="relative py-5 pb-28 gap-4 flex flex-col flex-1 min-h-screen">
          <PedidoResumoHeader produtos={produtos} />
          <CheckoutDadosCliente />
          <DeliveryOptions />
          <EnderecoModal loja={settings?.address ?? ""} />
          <BookingInputs />
          <PaymentCheckout />
          <FormNotaFiscal />
          <ResumoPedido
            produtosLength={produtos.length}
            subtotal={subtotal}
            taxaEntrega={taxaEntrega}
            valorFinal={valorFinal}
          />
        </main>
        <CheckoutButton
          valorFinal={valorFinal}
          handleFinish={form.handleSubmit(handleFinish)}
          enviando={createPedido.isPending}
        />
      </Container>
    </FormProvider>
  );
};

export default Finalizar;
