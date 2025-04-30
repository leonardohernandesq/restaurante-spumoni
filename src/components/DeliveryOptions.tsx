'use client'

import { FaMotorcycle, FaStore } from 'react-icons/fa6'

interface DeliveryOptionsProps {
    delivery: string
    setDelivery: (value: 'delivery' | 'takeaway') => void
}

export const DeliveryOptions = ({ delivery, setDelivery }: DeliveryOptionsProps) => {
    return (
        <section className="flex flex-col border-b border-zinc-200 pb-4 gap-1">
            <p className="text-xs mb-2">CLIQUE E SELECIONE UMA OPÇÃO</p>
            <div className="flex gap-2">
                <label htmlFor="delivery" className={`flex flex-col items-start ${delivery === 'delivery' ? 'bg-purple-principal-500 text-white shadow-lg' : 'bg-zinc-200 opacity-50 hover:opacity-70'} p-4 w-2/4 lg:w-1/4 rounded-md cursor-pointer transition-all shadow-md`}>
                    <input type="radio" id="delivery" name="delivery" className="hidden" checked={delivery === 'delivery'} onChange={() => setDelivery('delivery')} />
                    <FaMotorcycle size={40} className={`${delivery === 'delivery' ? 'text-white' : 'text-purple-principal-500'}`} />
                    <span className="mt-2 mb-1 font-bold">ENTREGAR</span>
                    <span className="text-xs mt-2">O pedido será entregue no seu endereço</span>
                </label>

                <label htmlFor="takeaway" className={`flex flex-col items-start ${delivery === 'takeaway' ? 'bg-green-principal-500 text-white shadow-lg' : 'bg-zinc-200 opacity-50 hover:opacity-70'} p-4 w-2/4 lg:w-1/4 rounded-md cursor-pointer transition-all shadow-md`}>
                    <input type="radio" id="takeaway" name="delivery" className="hidden" checked={delivery === 'takeaway'} onChange={() => setDelivery('takeaway')} />
                    <FaStore size={40} className={`${delivery === 'takeaway' ? 'text-white' : 'text-green-principal-500'}`} />
                    <span className="mt-2 mb-1 font-bold">RETIRAR EM LOJA</span>
                    <span className="text-xs mt-2">Você deverá retirar o pedido em loja</span>
                </label>
            </div>
        </section>
    )
}

