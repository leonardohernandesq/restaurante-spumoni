import { RequiredAsteristic } from "./RequiredAsteristic";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CheckoutFormData } from "@/interfaces/ICheckoutForm";
import { isValidPhone, formatPhone } from "@/utils/validators";

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
            validate: {
              validPhone: (value) =>
                isValidPhone(value) || "Telefone deve ter 10 ou 11 dígitos",
            },
            onChange: (e) => {
              const formatted = formatPhone(e.target.value);
              e.target.value = formatted;
            },
          })}
          id="telefone"
          type="text"
          placeholder="(XX) XXXXX-XXXX"
          maxLength={15}
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
