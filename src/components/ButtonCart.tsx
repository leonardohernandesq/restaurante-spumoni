import { ReactNode } from 'react'
import { ButtonHTMLAttributes } from 'react'

export interface IButtonCart extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    customClassName?: string;
}

export const ButtonCart = ({ children, customClassName, ...rest }: IButtonCart) => {
    return (
        <button
            className={
                `max-w-3xl m-auto flex justify-between items-center 
                cursor-pointer font-medium text-lg w-full bg-purple-principal-500 
                py-2.5 px-5 text-white rounded-xl 
                ${customClassName}`
            }
            {...rest}
        >
            {children}
        </button>
    )
}