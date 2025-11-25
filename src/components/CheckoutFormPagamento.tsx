import { PaymentCheckout } from "./PaymentCheckout";
import { FormNotaFiscal } from "./FormNotaFiscal";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CheckoutFormData } from "@/interfaces/ICheckoutForm";

interface CheckoutFormPagamentoProps {
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
}

export const CheckoutFormPagamento = ({
  watch,
  setValue,
}: CheckoutFormPagamentoProps) => {
  const payment = watch("forma_pagamento");
  const troco = watch("troco");
  const nf = watch("nota_fiscal");

  return (
    <>
      <PaymentCheckout
        payment={payment}
        setPayment={(value) => setValue("forma_pagamento", value)}
        troco={troco || ""}
        setTroco={(value) => setValue("troco", value)}
      />
      <FormNotaFiscal
        nf={nf || ""}
        setNf={(value) => setValue("nota_fiscal", value)}
      />
    </>
  );
};
