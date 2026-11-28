"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import type { CheckoutForm } from "@/domain/checkout";
import { validarAgendamento } from "@/domain/agendamento";
import { useOpeningHoursQuery } from "@/queries/config";

/** Entregar/retirar agora ou agendar (data validada pelos horários da loja). */
export const BookingInputs = () => {
  const { register, control } = useFormContext<CheckoutForm>();
  const [entrega, tipoEntrega] = useWatch({
    control,
    name: ["entrega", "tipoEntrega"],
  });
  const { data: openingHours = [] } = useOpeningHoursQuery();
  const isDelivery = tipoEntrega === "delivery";

  return (
    <div className="flex flex-col gap-2 pt-2 pb-5 border-b border-zinc-200">
      <div className="flex items-center gap-2 cursor-pointer">
        <input id="entrega-agora" type="radio" value="now" {...register("entrega")} />
        <label className="text-lg" htmlFor="entrega-agora">
          {isDelivery ? "Entregar agora" : "Retirar agora"}
        </label>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <input
          id="entrega-agendada"
          type="radio"
          value="booking"
          {...register("entrega")}
        />
        <label className="text-lg" htmlFor="entrega-agendada">
          {isDelivery ? "Agendar entrega" : "Agendar retirada"}
        </label>
      </div>

      {entrega === "booking" && (
        <div className="flex items-center p-2 pb-0 border border-zinc-400 rounded-md w-fit">
          <Controller
            control={control}
            name="dataEntrega"
            render={({ field }) => (
              <input
                {...field}
                className="mb-2 cursor-pointer"
                type="datetime-local"
                onChange={(e) => {
                  const erro = validarAgendamento(
                    e.target.value,
                    new Date(),
                    openingHours,
                  );
                  if (erro) {
                    toast.error(erro);
                    return;
                  }
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};
