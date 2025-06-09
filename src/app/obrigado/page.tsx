'use client'

import { pedidoStore } from '@/store/pedidoStore'
import { useEffect } from 'react';
import { BiCheck } from 'react-icons/bi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6'
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/Container';
import { CheckoutResume } from '@/components/CheckoutResume';

const Obrigado = () => {
    const { getPedidoById, pedido } = pedidoStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        const pedidoId = searchParams.get('pedido_id');
        if (pedidoId) {
            const id = parseInt(pedidoId);
            if (!isNaN(id)) {
                getPedidoById(id);
            }
        }
    }, [searchParams, getPedidoById]);

    console.log(pedido)
    return (
        <Container>
            <div className='flex flex-col items-center justify-center py-14 lg:h-screen lg:py-0'>
                <BiCheck size={100} className='bg-zinc-100 rounded-full text-green-principal-700 shadow mb-4' />
                <h1 className='text-4xl text-center font-medium text-green-principal-900 mb-12'>Obrigado pela sua compra!</h1>
                <div className='flex flex-col-reverse lg:flex-row items-center gap-10'>
                    <CheckoutResume pedido={pedido} />
                    <section className='flex w-full flex-col'>
                        <p className='py-2'>
                            Agradecemos imensamente por escolher o <strong className='text-green-principal-900'>Restaurante & Sorveteria Spumoni</strong>.
                            Seu pedido foi recebido com sucesso e está sendo preparado com todo
                            carinho e dedicação para garantir a melhor experiência gastronômica.
                        </p>
                        <p className='py-2'> Fique tranquilo, estamos cuidando de tudo para que sua refeição chegue até você com frescor e sabor! </p>
                        <p className='py-2'> Aproveite seu momento e, caso queira, não deixe de nos acompanhar nas redes sociais para mais novidades e promoções exclusivas! </p>
                        <div className='flex gap-2 text-3xl text-purple-principal-500 py-2'>
                            <FaInstagram />
                            <FaWhatsapp />
                        </div>
                        <h2 className='font-medium text-lg'>Desejamos a você uma excelente refeição!</h2>
                        <h2 className='text-lg'>Equipe <span className='text-purple-principal-900 font-medium'>Spumoni</span></h2>
                    </section>
                </div>
            </div>
        </Container>
    )
}

export default Obrigado