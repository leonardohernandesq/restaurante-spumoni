'use client'

import { useRouter } from 'next/navigation'
import { useEndereco } from '@/hooks/useEndereco'
import { Container } from '@/components/Container'
import { HeaderPages } from '@/components/HeaderPages'
import { PaymentCheckout } from '@/components/PaymentCheckout'
import { useResumoPedido } from '@/hooks/useResumoPedido'

import DeliveryOptions from '@/components/DeliveryOptions'
import EnderecoModal from '@/components/EnderecoModal'
import ResumoPedido from '@/components/ResumoPedido'
import FormNotaFiscal from '@/components/FormNotaFiscal'
import CheckoutButton from '@/components/CheckoutButton'
import PedidoResumoHeader from '@/components/PedidoResumoHeader'

import { cartStore } from '@/store/cartStore'
import { useState } from 'react'

const Finalizar = () => {
    const router = useRouter()
    const { produtos } = cartStore()

    const {
        endereco,
        showModal,
        setShowModal,
        addressError,
        setAddressError,
        errorEndereco,
        modalEndereco,
        modalNumero,
        modalComplemento,
        modalBairro,
        cep,
        modalReferencia,
        handleInputChange,
        handleCepChange,
        handleEndereco,
        preencherEnderecoAutomaticamente,
    } = useEndereco()

    const { subtotal, taxaEntrega, valorFinal } = useResumoPedido(produtos)

    const loja = 'R. Raimundo Correia, 38 - Centro, Poá - SP, 08557-030'

    const [delivery, setDelivery] = useState<'delivery' | 'takeaway'>('delivery')

    const handleFinish = () => {
        if (delivery === 'delivery' && !endereco) {
            setAddressError(true)
            alert('Por favor, insira um endereço válido para entrega.')
            return
        }
        // router.push('/obrigado')
    }

    return (
        <Container styleRow="bg-zinc-100">
            <HeaderPages title="Fazer pedido" />

            <main className="relative py-5 pb-28 gap-4 flex flex-col flex-1 min-h-screen">

                <PedidoResumoHeader produtos={produtos.map(produto => ({ ...produto, id: produto.id }))} />

                <DeliveryOptions delivery={delivery} setDelivery={setDelivery} />

                <EnderecoModal
                    endereco={endereco}
                    delivery={delivery}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    handleEndereco={handleEndereco}
                    preencherEnderecoAutomaticamente={preencherEnderecoAutomaticamente}
                    errorEndereco={errorEndereco}
                    addressError={addressError}
                    modalEndereco={modalEndereco}
                    modalNumero={modalNumero}
                    modalComplemento={modalComplemento}
                    modalBairro={modalBairro}
                    cep={cep}
                    modalReferencia={modalReferencia}
                    handleInputChange={handleInputChange}
                    handleCepChange={handleCepChange}
                    loja={loja}
                />

                <PaymentCheckout />
                <FormNotaFiscal />
                <ResumoPedido produtosLength={produtos.length} subtotal={subtotal} taxaEntrega={taxaEntrega} valorFinal={valorFinal} />

            </main>

            <CheckoutButton valorFinal={valorFinal} handleFinish={handleFinish} />
        </Container>
    )
}

export default Finalizar
