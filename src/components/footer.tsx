import React from 'react'
import Image from 'next/image'
import { DetailTitle } from '@/components/detail-title'
import { IoLocation } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import Link from 'next/link';
import { OpeningHoursFooter } from './opening-hours-footer';

export const Footer = () => {
  const horarios = [
    {
      "id": 1,
      "horario_abertura": '09:00:00',
      "horario_fechamento": '18:00:00',
      "dia_da_semana": "Segunda-feira"
    },
    {
      "id": 2,
      "horario_abertura": '09:00:00',
      "horario_fechamento": '18:00:00',
      "dia_da_semana": "Terça-feira"
    },
    {
      "id": 3,
      "horario_abertura": '09:00:00',
      "horario_fechamento": '18:00:00',
      "dia_da_semana": "Quarta-feira"
    },
    {
      "id": 4,
      "horario_abertura": '09:00:00',
      "horario_fechamento": '18:00:00',
      "dia_da_semana": "Quinta-feira"
    },
    {
      "id": 5,
      "horario_abertura": '09:00:00',
      "horario_fechamento": '18:00:00',
      "dia_da_semana": "Sexta-feira"
    },
    {
      "id": 6,
      "horario_abertura": '09:00:00',
      "horario_fechamento": '18:00:00',
      "dia_da_semana": "Sábado"
    },
    {
      "id": 7,
      "horario_abertura": '09:00:00',
      "horario_fechamento": '18:00:00',
      "dia_da_semana": "Domingo",
      "observacao": "Apenas retirada e Ifood"
    }
  ]


  return (
    <footer className='max-w-full px-7 py-12 gap-5 flex flex-col justify-between md:max-w-7xl md:m-auto bg-green-principal-500 text-white'>
      <Image src={'/logo-footer.svg'} alt='Logo do Restaurante Spumoni' width={300} height={60} />
      <p>Um lugar acolhedor onde o sabor se encontra com a tradição! Oferecemos pratos deliciosos, sobremesas irresistíveis e sorvetes artesanais feitos com ingredientes selecionados.</p>

      <section>
        <div className='flex items-center gap-2'>
          <DetailTitle />
          <h2 className='font-bold text-lg'>Horários de Funcionamento</h2>
        </div>
        <div className='py-2'>
          {
            horarios.map((item) => (
              <OpeningHoursFooter key={item.id}>
                {item.dia_da_semana}: {item.horario_abertura} às {item.horario_fechamento}
                {
                  item.observacao && (<><br /><span className='text-sm'>(apenas retirada e Ifood)</span></>)
                }
              </OpeningHoursFooter>
            ))
          }
        </div>
      </section>

      <section className='border-b border-b-green-500'>
        <div className='flex items-center gap-2 mb-3'>
          <DetailTitle />
          <h2 className='font-bold text-lg'>Contatos</h2>
        </div>
        <div className='flex gap-2 mt-2'>
          <IoLocation className='text-purple-principal-500 text-2xl w-7' />
          <p className='text-md w-full'>R. Raimundo Correia, 38 - Centro, Poá - SP, 08557-030</p>
        </div>
        <div className='text-purple-principal-500 flex gap-2 text-2xl my-4'>
          <Link href={'https://instagram.com/sorveteriaspumoni'} target='_blank'><IoLogoWhatsapp /></Link>
          <Link href={'https://facebook.com/sorveteriaspumoni'} target='_blank'><RiInstagramFill /></Link>
        </div>
      </section>

      <section className=' flex flex-col gap-3'>
        <p>Restaurante & Sorveteria Spumoni 2025. Todos os direitos reservados.</p>
        <p>Desenvolvido por <Link href={'http://www.lordsystem.com.br/'} target='_blank'>Lord System</Link>.</p>
      </section>
    </footer>
  )
}