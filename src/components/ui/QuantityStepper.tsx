import { FaMinus, FaPlus } from "react-icons/fa6";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
}

/** Botões − / + para quantidade (carrinho e página do produto). */
export const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  className = "",
}: QuantityStepperProps) => (
  <div
    className={`flex items-center justify-center gap-2 text-xs bg-purple-principal-500 text-white px-2 py-0.5 rounded-full w-fit ${className}`}
  >
    <button
      type="button"
      className="p-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => onChange(value - 1)}
      disabled={value <= min}
      aria-label="Diminuir quantidade"
    >
      <FaMinus />
    </button>
    <span>{value}</span>
    <button
      type="button"
      className="p-1 cursor-pointer"
      onClick={() => onChange(value + 1)}
      aria-label="Aumentar quantidade"
    >
      <FaPlus />
    </button>
  </div>
);
