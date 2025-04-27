import { useState, useEffect } from 'react'
import { useCep } from '@/hooks/useCep'

export const useEndereco = () => {
    const { cep, setCepValue, handleCepChange } = useCep()

    const [endereco, setEndereco] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [addressError, setAddressError] = useState(false)
    const [errorEndereco, setErrorEndereco] = useState('')

    const [modalEndereco, setModalEndereco] = useState('')
    const [modalNumero, setModalNumero] = useState('')
    const [modalComplemento, setModalComplemento] = useState('')
    const [modalBairro, setModalBairro] = useState('')
    const [modalReferencia, setModalReferencia] = useState('')

    useEffect(() => {
        const loadEndereco = localStorage.getItem('endereco')
        if (loadEndereco) {
            setEndereco(loadEndereco)
        }
    }, [])

    useEffect(() => {
        if (modalEndereco && modalNumero && modalBairro && cep) {
            setErrorEndereco('')
        }
    }, [modalEndereco, modalNumero, modalBairro, cep])

    const handleInputChange = (field: string, value: string) => {
        if (field === 'modalEndereco') setModalEndereco(value)
        if (field === 'modalNumero') setModalNumero(value)
        if (field === 'modalComplemento') setModalComplemento(value)
        if (field === 'modalBairro') setModalBairro(value)
        if (field === 'modalReferencia') setModalReferencia(value)
    }

    const handleEndereco = () => {
        if (!modalEndereco || !modalNumero || !modalBairro || !cep) {
            setErrorEndereco('Por favor, complete todos os campos obrigatórios: Endereço, Número, Bairro e CEP.')
            return
        }

        const parts = [
            modalEndereco ? `${modalEndereco}` : '',
            modalNumero ? `, ${modalNumero}` : '',
            modalComplemento ? ` ${modalComplemento}` : '',
            modalBairro ? ` - ${modalBairro}` : '',
            cep ? ` - ${cep}` : '',
        ]

        const mainAddress = parts.filter(Boolean).join('')
        const enderecoFormatado = modalReferencia ? `${mainAddress} | ${modalReferencia}` : mainAddress

        setEndereco(enderecoFormatado)
        localStorage.setItem('endereco', enderecoFormatado)
        setShowModal(false)
    }

    const preencherEnderecoAutomaticamente = async () => {
        if (!navigator.geolocation) {
            alert('Geolocalização não suportada.')
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    const response = await fetch(
                        `https://api.openrouteservice.org/geocode/reverse?api_key=${process.env.NEXT_PUBLIC_API_LOCATION_GET}&point.lon=${longitude}&point.lat=${latitude}`
                    )

                    if (!response.ok) {
                        throw new Error('Erro ao buscar o endereço na API.')
                    }

                    const data = await response.json()

                    if (data.features && data.features.length > 0) {
                        const enderecoData = data.features[0].properties

                        setModalEndereco(enderecoData.street || enderecoData.name || '')
                        setModalNumero(enderecoData.housenumber || '')
                        setModalComplemento('')
                        setModalBairro(
                            enderecoData.suburb ||
                            enderecoData.neighbourhood ||
                            enderecoData.locality ||
                            enderecoData.district ||
                            ''
                        )
                        const cepEncontrado = enderecoData.postcode || enderecoData.postalcode || enderecoData.zipcode || ''
                        setCepValue(cepEncontrado)
                        setModalReferencia('')
                    } else {
                        alert('Não foi possível encontrar seu endereço automaticamente.')
                    }
                } catch (error) {
                    console.error('Erro ao buscar endereço:', error)
                }
            },
            (error) => {
                console.error('Erro de geolocalização:', error)
                alert(`Erro ao pegar sua localização: ${error.message}`)
            }
        )
    }

    return {
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
    }
}
