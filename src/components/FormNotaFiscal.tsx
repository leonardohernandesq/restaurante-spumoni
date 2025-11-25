"use client";

import {
  isValidCPForCNPJ,
  formatCPForCNPJ,
  removeNonNumeric,
} from "@/utils/validators";
import { useState } from "react";

interface FormNotaFiscalProps {
  nf: string;
  setNf: (value: string) => void;
}

export const FormNotaFiscal = ({ nf, setNf }: FormNotaFiscalProps) => {
  const [error, setError] = useState("");

  const handleChange = (value: string) => {
    // Formata enquanto digita
    const formatted = formatCPForCNPJ(value);
    setNf(formatted);

    // Limpa erro quando usuário começa a digitar
    if (error) setError("");
  };

  const handleBlur = () => {
    // Valida apenas se o campo não estiver vazio
    if (nf && !isValidCPForCNPJ(nf)) {
      const cleanValue = removeNonNumeric(nf);
      if (cleanValue.length > 0 && cleanValue.length < 11) {
        setError("CPF incompleto");
      } else if (cleanValue.length > 11 && cleanValue.length < 14) {
        setError("CNPJ incompleto");
      } else {
        setError("CPF ou CNPJ inválido");
      }
    } else {
      setError("");
    }
  };

  return (
    <section className="flex flex-col border-b border-zinc-200 pb-4">
      <label htmlFor="nota-fiscal" className="mb-2">
        CPF OU CNPJ NA NOTA
      </label>
      <input
        value={nf}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        name="nota-fiscal"
        id="nota-fiscal"
        type="text"
        placeholder="XXX.XXX.XXX-XX ou XX.XXX.XXX/XXXX-XX"
        maxLength={18}
        className={`w-full p-2 border rounded-md ${
          error ? "border-red-500" : "border-zinc-400"
        }`}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </section>
  );
};
