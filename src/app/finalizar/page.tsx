"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { cartStore } from "@/store/cartStore";
import { pedidoStore } from "@/store/pedidoStore";

import { useEndereco } from "@/hooks/useEndereco";
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
import { RequiredAsteristic } from "@/components/RequiredAsteristic";
import { IPedidoCreate } from "@/interfaces/IPedidoCreate";

const Finalizar = () => {
  const router = useRouter();
  const loja =
    "Estrada da Giesteira 65/67, Arruda dos Vinhos, 2630-241, Portugal";

  const { insertPedido } = pedidoStore();
  const { produtos, limparCarrinho } = cartStore();

  const [delivery, setDelivery] = useState<"delivery" | "takeaway">("delivery");
  const [entrega, setEntrega] = useState<"booking" | "now">("now");
  const [bookingDate, setBookingDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("pix");
  const [troco, setTroco] = useState("");
  const [nf, setNf] = useState("");

  const pedidoFinalizadoRef = useRef(false);

  const produtosParaApi = produtos.map((produto) => ({
    produto_id: produto.id,
    quantidade: produto.quantidade,
    observacao: produto.observacoes || "",
    atributos: produto.atributos.map((attr) => ({
      atributo_id: attr.atributo_id ?? null,
      valor_atributo_id: attr.valor_atributo_id ?? null,
    })),
  }));

  const {
    endereco,
    showModal,
    setShowModal,
    abrirModalEndereco,
    addressError,
    setAddressError,
    errorEndereco,
    modalEndereco,
    setModalEndereco,
    modalNumero,
    setModalNumero,
    modalCidade,
    setModalCidade,
    modalComplemento,
    setModalComplemento,
    modalBairro,
    setModalBairro,
    cep,
    setCepValue,
    modalReferencia,
    handleInputChange,
    handleCepChange,
    handleEndereco,
  } = useEndereco();

  const { subtotal, taxaEntrega, valorFinal } = useResumoPedido(
    produtos,
    modalBairro,
    delivery,
  );

  const handleChangeBookingDate = (value: string) => {
    const bookingDate = new Date(value);
    const currentDate = new Date();

    if (bookingDate < currentDate) {
      toast.error("A data não pode ser no passado");
      return;
    }

    const bookingHours = bookingDate.getHours();
    const currentHours = currentDate.getHours();

    const isWithinBusinessHours = bookingHours >= 9 && bookingHours < 18;

    if (!isWithinBusinessHours) {
      toast.error("Insira um horário válido entre 9:00 e 18:00");
      return;
    }

    const isSameDay = bookingDate.toDateString() === currentDate.toDateString();

    if (isSameDay && bookingHours <= currentHours) {
      toast.error("Escolha um horário futuro para hoje");
      return;
    }

    setBookingDate(value);
  };

  useEffect(() => {
    if (pedidoFinalizadoRef.current) return;

    if (produtos.length === 0) {
      toast.error("Você não possui um produto!");
      router.replace("/");
    }
  }, [produtos, router]);

  const resetInputs = () => {
    setBookingDate("");
    setCepValue("");
    setDelivery("delivery");
    setEntrega("now");
    setModalBairro("");
    setModalComplemento("");
    setModalEndereco("");
    setModalNumero("");
    setName("");
    setNf("");
    setPayment("");
    setPhone("");
    setTroco("");
  };

  const handleFinish = async () => {
    if (delivery === "delivery" && !endereco) {
      setAddressError(true);
      toast.error("Por favor, insira um endereço válido para entrega.");
      return;
    }

    if (!name || !phone) {
      toast.error("Preencha todos os campos necessários para pedir");
      return;
    }

    const baseData: IPedidoCreate = {
      nome_cliente: name,
      telefone: phone,
      tipo_entrega: delivery,
      entrega: entrega,
      data_entrega: bookingDate || undefined,
      forma_pagamento: payment,
      troco: troco || undefined,
      nota_fiscal: nf || undefined,
      data_pedido: new Date().toISOString(),
      produtos: produtosParaApi,
    };

    if (delivery === "delivery") {
      Object.assign(baseData, {
        taxa_entrega: taxaEntrega || undefined,
        endereco_entrega: modalEndereco || undefined,
        bairro: modalBairro || undefined,
        numero: modalNumero || undefined,
        complemento: modalComplemento || undefined,
        cep: cep || undefined,
        referencia: modalReferencia || undefined,
      });
    }

    const data = baseData;

    try {
      const pedido_id = await insertPedido(data);
      pedidoFinalizadoRef.current = true;

      resetInputs();
      limparCarrinho();
      router.push(`/obrigado?pedido_id=${pedido_id}`);
      toast.success("Pedido enviado com sucesso!");
    } catch {
      return toast.error("Erro ao enviar o pedido, tente novamente!");
    }
  };

  return (
    <Container styleRow="bg-zinc-100">
      <HeaderPages title="Fazer pedido" />
      <main className="relative py-5 pb-28 gap-4 flex flex-col flex-1 min-h-screen">
        <PedidoResumoHeader
          produtos={produtos.map((produto) => ({ ...produto, id: produto.id }))}
        />

        <div>
          <label htmlFor="nome_cliente">
            Nome: <RequiredAsteristic />
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="nome-cliente"
            id="nome-cliente"
            type="text"
            placeholder="Digite o seu nome"
            className="w-full p-2 border border-zinc-400 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="whatsapp">
            Whatsapp: <RequiredAsteristic />
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            name="whatsapp"
            id="whatsapp"
            type="text"
            placeholder="Digite o seu telefone"
            className="w-full p-2 border border-zinc-400 rounded-md"
            required
          />
        </div>

        <DeliveryOptions delivery={delivery} setDelivery={setDelivery} />
        <EnderecoModal
          endereco={endereco}
          delivery={delivery}
          showModal={showModal}
          setShowModal={setShowModal}
          handleEndereco={handleEndereco}
          errorEndereco={errorEndereco}
          addressError={addressError}
          modalEndereco={modalEndereco}
          setModalEndereco={setModalEndereco}
          modalNumero={modalNumero}
          abrirModalEndereco={abrirModalEndereco}
          modalCidade={modalCidade}
          setModalCidade={setModalCidade}
          setModalNumero={setModalNumero}
          modalComplemento={modalComplemento}
          setModalComplemento={setModalComplemento}
          modalBairro={modalBairro}
          setModalBairro={setModalBairro}
          cep={cep}
          setCepValue={setCepValue}
          modalReferencia={modalReferencia}
          handleInputChange={handleInputChange}
          handleCepChange={handleCepChange}
          loja={loja}
        />

        <BookingInputs
          entrega={entrega}
          setEntrega={setEntrega}
          delivery={delivery}
          bookingDate={bookingDate}
          handleChangeBookingDate={handleChangeBookingDate}
        />

        <PaymentCheckout
          payment={payment}
          setPayment={setPayment}
          troco={troco}
          setTroco={setTroco}
        />
        <FormNotaFiscal nf={nf} setNf={setNf} />
        <ResumoPedido
          produtosLength={produtos.length}
          subtotal={subtotal}
          taxaEntrega={taxaEntrega}
          valorFinal={valorFinal}
        />
      </main>
      <CheckoutButton valorFinal={valorFinal} handleFinish={handleFinish} />
    </Container>
  );
};

export default Finalizar;
