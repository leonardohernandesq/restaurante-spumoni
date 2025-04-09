import React from 'react'
import { BiCheck } from 'react-icons/bi'
import { FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa6'

const Obrigado = () => {
    return (
        <main className='px-10 flex flex-col h-screen items-center justify-center '>
            <BiCheck size={150} className='bg-zinc-100 rounded-full mb-4 text-green-principal-700 shadow' />
            <h1 className='text-2xl text-center font-medium mb-4 text-green-principal-900'>Obrigada pela sua compra!</h1>
            <p className='py-2'>
                Agradecemos imensamente por escolher o <strong className='text-green-principal-900'>Restaurante & Sorveteria Spumoni</strong>.
                Seu pedido foi recebido com sucesso e está sendo preparado com todo
                carinho e dedicação para garantir a melhor experiência gastronômica.
            </p>
            <p className='py-2'> Fique tranquilo, estamos cuidando de tudo para que sua refeição chegue até você com frescor e sabor! </p>
            <p className='py-2'> Aproveite seu momento e, caso queira, não deixe de nos acompanhar nas redes sociais para mais novidades e promoções exclusivas! </p>
            <div className='flex gap-2 text-3xl text-purple-principal-500 py-2 justify-center'>
                <FaInstagram />
                <FaWhatsapp />
            </div>
            <h2 className='font-medium text-lg text-center'>Desejamos a você uma excelente refeição!</h2>
            <h2 className='text-lg text-center'>Equipe <span className='text-purple-principal-900 font-medium'>Spumoni</span></h2>
        </main>
    )
}

export default Obrigado