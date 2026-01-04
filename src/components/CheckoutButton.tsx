"use client";

import { ButtonCart } from "@/components/ButtonCart";
import { ICheckoutButtonProps } from "@/interfaces/ICheckoutButtonProps";
import { formatCurrencyBRL } from "@/utils/validators";

export const CheckoutButton = ({
  valorFinal,
  handleFinish,
}: ICheckoutButtonProps) => {
  return (
    <section className="bg-white shadow-2xl fixed bottom-0 left-2/4 -translate-x-2/4 max-w-full w-full px-7 py-5 gap-4 flex flex-col">
      <ButtonCart customClassName="text-center" onClick={handleFinish}>
        <p>FAZER PEDIDO</p>
        <p>{formatCurrencyBRL(Number(valorFinal))}</p>
      </ButtonCart>
    </section>
  );
};
