import { ReactNode } from "react";
import { ButtonHTMLAttributes } from "react";

export interface IButtonCart extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isDisabled?: boolean;
  customClassName?: string;
}

export const ButtonCart = ({
  children,
  customClassName,
  isDisabled,
  ...rest
}: IButtonCart) => {
  return (
    <button
      disabled={isDisabled}
      className={`max-w-3xl m-auto flex justify-between items-center 
                cursor-pointer font-medium text-lg w-full bg-purple-principal-500 
                py-2.5 px-5 text-white rounded-xl 
                ${customClassName}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-600`}
      {...rest}
    >
      {children}
    </button>
  );
};
