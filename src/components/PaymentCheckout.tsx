"use client";

import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import type { CheckoutForm } from "@/domain/checkout";

const FORMAS = [
  { valor: "pix", label: "PIX", icone: "/pix.svg" },
  { valor: "cartao", label: "CARTÃO", icone: "/card.svg" },
  { valor: "dinheiro", label: "DINHEIRO", icone: "/money.svg" },
] as const;

/** Forma de pagamento e, no dinheiro, o troco. */
export const PaymentCheckout = () => {
  const { register, control } = useFormContext<CheckoutForm>();
  const formaPagamento = useWatch({ control, name: "formaPagamento" });

  return (
    <section className="flex flex-col border-b border-zinc-200 pb-4">
      <div className="mb-2">
        <p className="font-light text-xs mb-1">OBRIGATÓRIO</p>
        <p>FORMA DE PAGAMENTO</p>
      </div>
      <div className="flex gap-2">
        {FORMAS.map(({ valor, label, icone }) => {
          const selecionado = formaPagamento === valor;
          return (
            <label
              key={valor}
              htmlFor={valor}
              className={`flex flex-col items-center ${
                selecionado
                  ? "bg-zinc-800 text-white shadow-lg"
                  : "bg-zinc-200 text-zinc-800 opacity-50 hover:opacity-60"
              } p-2 w-full lg:w-48 rounded-md cursor-pointer transition-all shadow-md`}
            >
              <input
                className="hidden"
                type="radio"
                id={valor}
                value={valor}
                {...register("formaPagamento")}
              />
              <Image
                className={selecionado ? "invert-100" : ""}
                src={icone}
                alt={label}
                height={40}
                width={40}
              />
              <span className="text-sm mt-1">{label}</span>
            </label>
          );
        })}
      </div>

      {formaPagamento === "dinheiro" && (
        <>
          <label htmlFor="troco" className="mt-5 mb-1">
            PRECISA DE TROCO?
          </label>
          <input
            {...register("troco")}
            id="troco"
            placeholder="Insira o valor"
            type="number"
            min={0}
            className="w-full p-2 border border-zinc-400 rounded-md"
          />
        </>
      )}
    </section>
  );
};
