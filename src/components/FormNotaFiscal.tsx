"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { isValidCPForCNPJ } from "@/utils/validators";
import { formatCPForCNPJ, removeNonNumeric } from "@/utils/format";
import type { CheckoutForm } from "@/domain/checkout";

const mensagemDeErro = (valor: string): string => {
  if (!valor || isValidCPForCNPJ(valor)) return "";

  const digitos = removeNonNumeric(valor).length;
  if (digitos < 11) return "CPF incompleto";
  if (digitos > 11 && digitos < 14) return "CNPJ incompleto";
  return "CPF ou CNPJ inválido";
};

/** CPF/CNPJ opcional na nota (formatado ao digitar, validado ao sair). */
export const FormNotaFiscal = () => {
  const { control } = useFormContext<CheckoutForm>();
  const [error, setError] = useState("");

  return (
    <section className="flex flex-col border-b border-zinc-200 pb-4">
      <label htmlFor="nota-fiscal" className="mb-2">
        CPF OU CNPJ NA NOTA
      </label>
      <Controller
        control={control}
        name="notaFiscal"
        render={({ field }) => (
          <input
            {...field}
            onChange={(e) => {
              field.onChange(formatCPForCNPJ(e.target.value));
              if (error) setError("");
            }}
            onBlur={() => {
              field.onBlur();
              setError(mensagemDeErro(field.value));
            }}
            id="nota-fiscal"
            type="text"
            placeholder="XXX.XXX.XXX-XX ou XX.XXX.XXX/XXXX-XX"
            maxLength={18}
            className={`w-full p-2 border rounded-md ${
              error ? "border-red-500" : "border-zinc-400"
            }`}
          />
        )}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </section>
  );
};
