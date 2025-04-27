'use client'

import { BiPencil, BiLocationPlus } from 'react-icons/bi'

interface EnderecoModalProps {
    endereco: string
    delivery: string
    showModal: boolean
    setShowModal: (value: boolean) => void
    handleEndereco: () => void
    preencherEnderecoAutomaticamente: () => void
    errorEndereco: string
    addressError: boolean
    modalEndereco: string
    modalNumero: string
    modalComplemento: string
    modalBairro: string
    cep: string
    modalReferencia: string
    handleInputChange: (field: string, value: string) => void
    handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    loja: string
}

export const EnderecoModal = ({
    endereco,
    delivery,
    showModal,
    setShowModal,
    handleEndereco,
    preencherEnderecoAutomaticamente,
    errorEndereco,
    addressError,
    modalEndereco,
    modalNumero,
    modalComplemento,
    modalBairro,
    cep,
    modalReferencia,
    handleInputChange,
    handleCepChange,
    loja
}: EnderecoModalProps) => {
    return (
        <section className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
                <p className="font-light">{delivery === 'delivery' ? 'ENTREGAR EM' : 'RETIRAR EM'}</p>
                <p className="font-medium pr-2">{delivery === 'delivery' ? endereco : loja}</p>
                {addressError && <p className="text-red-700">Você deve inserir um endereço válido</p>}
            </div>

            {delivery === 'delivery' && (
                <>
                    <div>
                        <button className={`bg-purple-principal-700 text-white p-2 rounded-full ${addressError && 'animate-bounce'} cursor-pointer`} onClick={() => setShowModal(true)}>
                            <BiPencil />
                        </button>

                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                                    <button className="ml-auto mb-4 text-gray-700" onClick={() => setShowModal(false)}>X</button>
                                    <h2 className="text-center text-2xl mb-4">Insira seu endereço</h2>

                                    <button
                                        onClick={preencherEnderecoAutomaticamente}
                                        className="flex flex-col items-center bg-green-principal-500 text-white p-2 rounded-md hover:bg-green-principal-900 cursor-pointer w-full mb-4"
                                    >
                                        <BiLocationPlus size={20} />
                                        Endereço Atual
                                    </button>

                                    <div className="flex flex-col gap-3">
                                        <input value={modalEndereco} onChange={(e) => handleInputChange('modalEndereco', e.target.value)} placeholder="Endereço" className="w-full p-2 border border-zinc-400 rounded-md" />
                                        <div className="flex gap-3">
                                            <input value={modalNumero} onChange={(e) => handleInputChange('modalNumero', e.target.value)} placeholder="Número" className="w-full p-2 border border-zinc-400 rounded-md" />
                                            <input value={modalComplemento} onChange={(e) => handleInputChange('modalComplemento', e.target.value)} placeholder="Complemento" className="w-1/3 p-2 border border-zinc-400 rounded-md" />
                                            <input value={modalBairro} onChange={(e) => handleInputChange('modalBairro', e.target.value)} placeholder="Bairro" className="w-full p-2 border border-zinc-400 rounded-md" />
                                        </div>
                                        <input value={cep} onChange={handleCepChange} placeholder="CEP" pattern="\d{5}-\d{3}" className="w-full p-2 border border-zinc-400 rounded-md" />
                                        <textarea value={modalReferencia} onChange={(e) => handleInputChange('modalReferencia', e.target.value)} placeholder="Insira uma referência" className="w-full h-24 p-2 border border-zinc-400 rounded-md"></textarea>

                                        {errorEndereco && <p className="text-red-600">{errorEndereco}</p>}

                                        <button
                                            disabled={!!errorEndereco}
                                            onClick={handleEndereco}
                                            className="bg-purple-principal-500 p-2 rounded-md text-white cursor-pointer hover:bg-purple-principal-900 disabled:bg-zinc-800 disabled:opacity-20 disabled:cursor-no-drop w-full"
                                        >
                                            Adicionar Endereço
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    )
}

export default EnderecoModal
