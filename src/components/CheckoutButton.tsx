'use client'

import { ButtonCart } from '@/components/ButtonCart'

interface CheckoutButtonProps {
    valorFinal: string
    handleFinish: () => void
}

export const CheckoutButton = ({ valorFinal, handleFinish }: CheckoutButtonProps) => {
    return (
        <section className="bg-white shadow-2xl fixed bottom-0 left-2/4 -translate-x-2/4 max-w-full w-full px-7 py-5 gap-4 flex flex-col">
            <ButtonCart customClassName="text-center" onClick={handleFinish}>
                <p>FAZER PEDIDO</p>
                <p>R$ {valorFinal}</p>
            </ButtonCart>
        </section>
    )
}

export default CheckoutButton
