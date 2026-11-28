"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FaMotorcycle, FaStore } from "react-icons/fa6";
import type { CheckoutForm } from "@/domain/checkout";

const OPCOES = [
  {
    valor: "delivery",
    titulo: "ENTREGAR",
    descricao: "O pedido será entregue no seu endereço",
    Icone: FaMotorcycle,
    ativo: "bg-purple-principal-500",
    icone: "text-purple-principal-500",
  },
  {
    valor: "takeaway",
    titulo: "RETIRAR EM LOJA",
    descricao: "Você deverá retirar o pedido em loja",
    Icone: FaStore,
    ativo: "bg-green-principal-500",
    icone: "text-green-principal-500",
  },
] as const;

/** Escolha entre entrega e retirada. */
export const DeliveryOptions = () => {
  const { register, control } = useFormContext<CheckoutForm>();
  const tipoEntrega = useWatch({ control, name: "tipoEntrega" });

  return (
    <section className="flex flex-col border-b border-zinc-200 pb-4 gap-1">
      <p className="text-xs mb-2">CLIQUE E SELECIONE UMA OPÇÃO</p>
      <div className="flex gap-2">
        {OPCOES.map(({ valor, titulo, descricao, Icone, ativo, icone }) => {
          const selecionado = tipoEntrega === valor;
          return (
            <label
              key={valor}
              htmlFor={valor}
              className={`flex flex-col items-start ${
                selecionado
                  ? `${ativo} text-white shadow-lg`
                  : "bg-zinc-200 opacity-50 hover:opacity-70"
              } p-4 w-2/4 lg:w-1/4 rounded-md cursor-pointer transition-all shadow-md`}
            >
              <input
                type="radio"
                id={valor}
                value={valor}
                className="hidden"
                {...register("tipoEntrega")}
              />
              <Icone size={40} className={selecionado ? "text-white" : icone} />
              <span className="mt-2 mb-1 font-bold">{titulo}</span>
              <span className="text-xs mt-2">{descricao}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
};
