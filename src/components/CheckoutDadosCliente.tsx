"use client";

import { Controller, useFormContext } from "react-hook-form";
import { RequiredAsteristic } from "@/components/RequiredAsteristic";
import {
  isTelefoneValido,
  MENSAGEM_TELEFONE_INVALIDO,
  type CheckoutForm,
} from "@/domain/checkout";
import { formatPhone } from "@/utils/format";

const inputClass = "w-full p-2 border rounded-md";
const borda = (erro: boolean) => (erro ? "border-red-500" : "border-zinc-400");

/** Nome e WhatsApp do cliente. */
export const CheckoutDadosCliente = () => {
  const {
    register,
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<CheckoutForm>();

  return (
    <>
      <div>
        <label htmlFor="nome-cliente">
          Nome: <RequiredAsteristic />
        </label>
        <input
          {...register("nome")}
          id="nome-cliente"
          type="text"
          placeholder="Digite o seu nome"
          autoComplete="name"
          className={`${inputClass} ${borda(!!errors.nome)}`}
        />
      </div>

      <div>
        <label htmlFor="whatsapp">
          Whatsapp: <RequiredAsteristic />
        </label>
        <Controller
          control={control}
          name="telefone"
          render={({ field }) => (
            <input
              {...field}
              // Mostra com máscara, guarda só os números (também ao colar)
              value={formatPhone(field.value ?? "")}
              onChange={(e) => {
                let digitos = e.target.value.replace(/\D/g, "");
                // Colou com +55 na frente
                if (digitos.length > 11 && digitos.startsWith("55")) digitos = digitos.slice(2);
                field.onChange(digitos.slice(0, 11));
                if (errors.telefone && isTelefoneValido(digitos)) clearErrors("telefone");
              }}
              id="whatsapp"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(11) 99999-9999"
              aria-invalid={!!errors.telefone}
              aria-describedby={errors.telefone ? "whatsapp-ajuda" : undefined}
              className={`${inputClass} ${borda(!!errors.telefone)}`}
            />
          )}
        />
        {errors.telefone?.message === MENSAGEM_TELEFONE_INVALIDO && (
          <p id="whatsapp-ajuda" className="mt-1 text-sm text-red-600">
            {MENSAGEM_TELEFONE_INVALIDO}
          </p>
        )}
      </div>
    </>
  );
};
