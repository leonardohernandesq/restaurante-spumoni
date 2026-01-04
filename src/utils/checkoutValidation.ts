import { ValidateCheckoutParams } from "@/interfaces/IValidateCheckoutParams";
import { toast } from "react-toastify";

export const validateCheckout = ({
  data,
  isDelivery,
  endereco,
  setAddressError,
}: ValidateCheckoutParams): boolean => {
  if (isDelivery && !endereco) {
    setAddressError(true);
    toast.error("Por favor, insira um endereço válido para entrega.");
    return false;
  }

  if (!data.nome_cliente || !data.telefone) {
    toast.error("Preencha todos os campos necessários para pedir");
    return false;
  }

  return true;
};
