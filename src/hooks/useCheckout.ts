import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { cartStore } from "@/store/cartStore";
import { pedidoStore } from "@/store/pedidoStore";
import { useEndereco } from "@/hooks/useEndereco";
import { useResumoPedido } from "@/hooks/useResumoPedido";
import { IPedidoCreate } from "@/interfaces/IPedidoCreate";
import { CheckoutFormData } from "@/interfaces/ICheckoutForm";

export const useCheckout = () => {
  const router = useRouter();
  const { insertPedido } = pedidoStore();
  const { produtos, limparCarrinho } = cartStore();

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      nome_cliente: "",
      telefone: "",
      tipo_entrega: "delivery",
      entrega: "now",
      data_entrega: "",
      forma_pagamento: "pix",
      troco: "",
      nota_fiscal: "",
      endereco_entrega: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      referencia: "",
    },
  });

  // Watch form values
  const delivery = watch("tipo_entrega");
  const entrega = watch("entrega");

  // Hook de endereço
  const enderecoHook = useEndereco();
  const { endereco, distanciaCliente, setAddressError } = enderecoHook;

  // Cálculos do pedido
  const { subtotal, taxaEntrega, valorFinal } = useResumoPedido(
    produtos,
    distanciaCliente,
    delivery
  );

  // Preparar produtos para API
  const produtosParaApi = produtos.map((produto) => ({
    produto_id: produto.id,
    quantidade: produto.quantidade,
    observacao: produto.observacoes || "",
    atributos: produto.atributos.map((attr) => ({
      atributo_id: attr.atributo_id ?? null,
      valor_atributo_id: attr.valor_atributo_id ?? null,
    })),
  }));

  // Validar carrinho
  useEffect(() => {
    if (produtos.length <= 0) {
      toast.error("Você não possui um produto!");
      limparCarrinho();
      router.push("/");
    }
  }, [produtos.length, limparCarrinho, router]);

  // Validação de data de agendamento
  const handleChangeBookingDate = (value: string) => {
    const bookingDateObj = new Date(value);
    const currentDate = new Date();

    if (bookingDateObj < currentDate) {
      toast.error("A data não pode ser no passado");
      return;
    }

    const bookingHours = bookingDateObj.getHours();
    const currentHours = currentDate.getHours();
    const isWithinBusinessHours = bookingHours >= 9 && bookingHours < 18;

    if (!isWithinBusinessHours) {
      toast.error("Insira um horário válido entre 9:00 e 18:00");
      return;
    }

    const isSameDay =
      bookingDateObj.toDateString() === currentDate.toDateString();

    if (isSameDay && bookingHours <= currentHours) {
      toast.error("Escolha um horário futuro para hoje");
      return;
    }

    setValue("data_entrega", value);
  };

  // Resetar formulário e endereço
  const resetForm = () => {
    reset();
    enderecoHook.setCepValue("");
    enderecoHook.setModalBairro("");
    enderecoHook.setModalComplemento("");
    enderecoHook.setModalEndereco("");
    enderecoHook.setModalNumero("");
  };

  // Validações do checkout
  const validateCheckout = (data: CheckoutFormData): boolean => {
    if (data.tipo_entrega === "delivery" && !endereco) {
      setAddressError(true);
      toast.error("Por favor, insira um endereço válido para entrega.");
      return false;
    }

    if (distanciaCliente !== null && distanciaCliente > 10) {
      toast.error(
        "Desculpe, no momento só entregamos em até 10 km de distância."
      );
      return false;
    }

    if (!data.nome_cliente || !data.telefone) {
      toast.error("Preencha todos os campos necessários para pedir");
      return false;
    }

    return true;
  };

  // Preparar dados do pedido
  const preparePedidoData = (data: CheckoutFormData): IPedidoCreate => {
    const baseData: IPedidoCreate = {
      nome_cliente: data.nome_cliente,
      telefone: data.telefone,
      tipo_entrega: data.tipo_entrega,
      entrega: data.entrega,
      data_entrega: data.data_entrega || undefined,
      forma_pagamento: data.forma_pagamento,
      troco: data.troco || undefined,
      nota_fiscal: data.nota_fiscal || undefined,
      data_pedido: new Date().toISOString(),
      produtos: produtosParaApi,
    };

    if (data.tipo_entrega === "delivery") {
      Object.assign(baseData, {
        distancia: distanciaCliente || undefined,
        taxa_entrega: taxaEntrega || undefined,
        endereco_entrega: enderecoHook.modalEndereco || undefined,
        bairro: enderecoHook.modalBairro || undefined,
        numero: enderecoHook.modalNumero || undefined,
        complemento: enderecoHook.modalComplemento || undefined,
        cep: enderecoHook.cep || undefined,
        referencia: enderecoHook.modalReferencia || undefined,
      });
    }

    return baseData;
  };

  // Finalizar pedido
  const onSubmit = async (data: CheckoutFormData) => {
    if (!validateCheckout(data)) {
      return;
    }

    const pedidoData = preparePedidoData(data);

    try {
      const pedido_id = await insertPedido(pedidoData);
      resetForm();
      limparCarrinho();
      toast.success("Pedido enviado com sucesso!");
      router.push(`/obrigado?pedido_id=${pedido_id}`);
    } catch {
      toast.error("Erro ao enviar o pedido, tente novamente!");
    }
  };

  return {
    // React Hook Form
    register,
    handleSubmit,
    watch,
    setValue,
    errors,

    // Estados observados
    delivery,
    entrega,

    // Funções
    handleChangeBookingDate,
    onSubmit,

    // Dados calculados
    produtos,
    subtotal,
    taxaEntrega,
    valorFinal,

    // Endereço
    enderecoHook,
  };
};
