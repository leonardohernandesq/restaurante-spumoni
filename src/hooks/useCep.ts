import { useState } from "react";

export const useCep = () => {
  const [cep, setCep] = useState("");

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 5) {
      return digits;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCep(formatCep(e.target.value));
  };

  const setCepValue = (value: string) => {
    setCep(formatCep(value));
  };

  return { cep, handleCepChange, setCepValue };
};
