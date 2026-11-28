export interface ICheckoutButtonProps {
    valorFinal: number
    handleFinish: () => void
    /** Pedido sendo enviado: desabilita o botão para evitar duplicidade. */
    enviando?: boolean
}
