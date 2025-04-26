'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BiPencil } from 'react-icons/bi'
import { FaMotorcycle, FaStore } from 'react-icons/fa6'

import { ButtonCart } from '@/components/ButtonCart'
import { Container } from '@/components/Container'
import { HeaderPages } from '@/components/HeaderPages'
import { Modal } from '@/components/Modal'
import { PaymentCheckout } from '@/components/PaymentCheckout'

import { cartStore } from '@/store/cartStore'
import { useCep } from '@/hooks/useCep'

const Carrinho = () => {
    const router = useRouter();
    const { produtos } = cartStore();
    const subtotal = produtos.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2);
    const loja = 'R. Raimundo Correia, 38 - Centro, Poá - SP, 08557-030';
    const { cep, handleCepChange } = useCep();
    const [showModal, setShowModal] = useState(false);
    const [endereco, setEndereco] = useState('');
    const [delivery, setDelivery] = useState('delivery');
    const [modalEndereco, setModalEndereco] = useState('');
    const [modalNumero, setModalNumero] = useState('');
    const [modalComplemento, setModalComplemento] = useState('');
    const [addressError, setAddressError] = useState(false);
    const [modalReferencia, setModalReferencia] = useState('');

    useEffect(() => {
        const loadEndereco = localStorage.getItem('endereco');
        if (loadEndereco) {
            setEndereco(loadEndereco);
        }
    }, [])

    const handleFinish = () => {
        router.push('/obrigado')
    }

    const handleEndereco = () => {
        const enderecoFormatado = `${modalEndereco}, ${modalNumero} ${modalComplemento} - ${cep} | ${modalReferencia}`;
        setEndereco(enderecoFormatado);
        localStorage.setItem('endereco', enderecoFormatado);
        setShowModal(false);
    };

    return (
        <Container styleRow='bg-zinc-100'>
            <HeaderPages title='Fazer pedido' />
            <main className='relative py-5 pb-28 gap-4 flex flex-col flex-1 min-h-screen'>
                <section className='flex items-center justify-between border-b border-zinc-200 pb-4'>
                    <div>
                        <p className='font-light'>SEU PEDIDO</p>
                        <p className='font-medium'>{produtos.length == 1 ? `${produtos.length} Item` : `${produtos.length} Itens`} </p>
                    </div>
                    <div className='flex opacity-75'>
                        {
                            produtos.map((produto) => (
                                <Image className='shadow rounded-full ml-[-10]' key={produto.id} src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${produto.imagem}`} alt={`${produto.nome}`} width={40} height={40} />
                            ))
                        }
                    </div>
                </section>
                <section className='flex flex-col border-b border-zinc-200 pb-4 gap-1'>
                    <p className='text-xs mb-2'>CLIQUE E SELECIONE UMA OPÇÃO</p>
                    <div className='flex gap-2'>
                        <label htmlFor="delivery" className={`flex flex-col items-start ${delivery === 'delivery' ? 'bg-purple-principal-500 text-white shadow-lg' : 'bg-zinc-200 opacity-50 hover:opacity-70'} p-4 w-2/4 lg:w-1/4 rounded-md cursor-pointer transition-all shadow-md`}>
                            <input className='hidden' type="radio" name="delivery" id="delivery" checked={delivery === 'delivery'} onChange={() => setDelivery('delivery')} />
                            <FaMotorcycle size={40} className={`${delivery === 'delivery' ? 'text-white' : 'text-purple-principal-500'}`} />

                            <span className={`${delivery === 'delivery' ? 'text-white' : 'text-purple-principal-500'} mt-2 mb-1 font-bold`}>ENTREGAR</span>
                            <span className='text-xs mt-2'>O pedido será entregue no seu endereço</span>
                        </label>
                        <label htmlFor="takeaway" className={`flex flex-col items-start ${delivery === 'takeaway' ? 'bg-green-principal-500 text-white shadow-lg' : 'bg-zinc-200 opacity-50 hover:opacity-70'} p-4 w-2/4 lg:w-1/4 rounded-md cursor-pointer transition-all shadow-md`}>
                            <input className='hidden' type="radio" name="delivery" id="takeaway" checked={delivery === 'takeaway'} onChange={() => setDelivery('takeaway')} />
                            <FaStore size={40} className={`${delivery === 'takeaway' ? 'text-white' : 'text-green-principal-500'}`} />
                            <span className={`${delivery === 'takeaway' ? 'text-white' : 'text-green-principal-500'} mt-2 mb-1 font-bold`}>RETIRAR EM LOJA</span>
                            <span className='text-xs mt-2'>Você deverá retirar o pedido em loja</span>
                        </label>
                    </div>
                </section>

                <section className='flex items-center justify-between border-b border-zinc-200 pb-4'>
                    <div>
                        <p className='font-light'>{delivery === 'delivery' ? 'ENTREGAR EM' : 'RETIRAR EM'}</p>
                        <p className='font-medium pr-2'>{delivery === 'delivery' ? endereco : loja}</p>
                        {
                            addressError && <p className='text-red-700'>Você deve inserir um endereço válido</p>
                        }
                    </div>
                    {delivery === 'delivery' && (
                        <>
                            <div>

                                <button className={`bg-purple-principal-700 text-white p-2 rounded-full ${addressError && 'animate-bounce'} cursor-pointer`} onClick={() => setShowModal(true)}>
                                    <BiPencil />
                                </button>

                                {showModal && (
                                    <Modal onClose={() => setShowModal(false)}>
                                        <h2 className='text-center text-2xl mb-4'>Insira seu endereço</h2>

                                        <div className='flex flex-col mt-4 gap-3'>
                                            <input value={modalEndereco} onChange={(e) => setModalEndereco(e.target.value)} placeholder='Endereço' type='text' className='w-full p-2 border border-zinc-400 rounded-md' />
                                            <div className='flex gap-3'>
                                                <input value={modalNumero} onChange={(e) => setModalNumero(e.target.value)} placeholder='Número' type='text' className='w-1/3 p-2 border border-zinc-400 rounded-md' />
                                                <input value={modalComplemento} onChange={(e) => setModalComplemento(e.target.value)} placeholder='Complemento' type='text' className='w-full p-2 border border-zinc-400 rounded-md' />
                                            </div>
                                            <input placeholder='CEP' type='text' className='w-full p-2 border border-zinc-400 rounded-md' pattern="\d{5}-\d{3}" value={cep} onChange={handleCepChange} />
                                            <textarea value={modalReferencia} onChange={(e) => setModalReferencia(e.target.value)} placeholder='Insira uma referência' className='w-full h-24 p-2 border border-zinc-400 rounded-md'></textarea>
                                            <button onClick={() => handleEndereco()} className='bg-purple-principal-500 p-2 rounded-md text-white cursor-pointer hover:bg-purple-principal-900'>Adicionar Endereço</button>
                                        </div>
                                    </Modal>
                                )}
                            </div>
                        </>
                    )}

                </section>

                <PaymentCheckout />

                <section className='flex flex-col border-b border-zinc-200 pb-4'>
                    <label htmlFor='nota-fiscal' className='mb-2'>CPF OU CNPJ NA NOTA</label>
                    <input name='nota-fiscal' id='nota-fiscal' type="text" placeholder='XXX.XXX.XXX-XX' className='w-full p-2 border border-zinc-400 rounded-md' />
                </section>

                <section className='text-zinc-700'>
                    <p className='text-sm'>RESUMO</p>
                    <div className='flex justify-between items-center my-2 text-sm'>
                        <p>{produtos.length == 1 ? `${produtos.length} Item` : `${produtos.length} Itens`}</p>
                        <p>R$ {subtotal}</p>
                    </div>
                    <div className='flex justify-between items-center my-2 text-sm'>
                        <p>Entrega</p>
                        <p>R$ 5,99</p>
                    </div>
                    <div className='flex justify-between items-center my-2 text-sm'>
                        <p>Total</p>
                        <p>R$ {subtotal}</p>
                    </div>
                </section>
            </main>
            <section className='bg-white shadow-2xl fixed bottom-0 left-2/4 -translate-x-2/4 max-w-full w-full px-7 py-5 gap-4 flex flex-col'>
                <ButtonCart customClassName='text-center' onClick={() => handleFinish()}>
                    <p>FAZER PEDIDO</p>
                    <p>R$ {subtotal}</p>
                </ButtonCart>
            </section>
        </Container>
    )
}

export default Carrinho