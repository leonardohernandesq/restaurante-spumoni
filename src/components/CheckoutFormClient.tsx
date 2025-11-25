import { RequiredAsteristic } from "./RequiredAsteristic";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CheckoutFormData } from "@/interfaces/ICheckoutForm";

interface CheckoutFormClientProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export const CheckoutFormClient = ({
  register,
  errors,
}: CheckoutFormClientProps) => {
  return (
    <>
      <div>
        <label htmlFor="nome_cliente">
          Nome: <RequiredAsteristic />
        </label>
        <input
          {...register("nome_cliente", {
            required: "Nome é obrigatório",
            minLength: {
              value: 3,
              message: "Nome deve ter no mínimo 3 caracteres",
            },
          })}
          id="nome_cliente"
          type="text"
          placeholder="Digite o seu nome"
          className={`w-full p-2 border rounded-md ${
            errors.nome_cliente ? "border-red-500" : "border-zinc-400"
          }`}
        />
        {errors.nome_cliente && (
          <span className="text-red-500 text-sm">
            {errors.nome_cliente.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="telefone">
          Whatsapp: <RequiredAsteristic />
        </label>
        <input
          {...register("telefone", {
            required: "Telefone é obrigatório",
            pattern: {
              value: /^[0-9+\s()-]+$/,
              message: "Formato de telefone inválido",
            },
          })}
          id="telefone"
          type="text"
          placeholder="Digite o seu telefone"
          className={`w-full p-2 border rounded-md ${
            errors.telefone ? "border-red-500" : "border-zinc-400"
          }`}
        />
        {errors.telefone && (
          <span className="text-red-500 text-sm">
            {errors.telefone.message}
          </span>
        )}
      </div>
    </>
  );
};
