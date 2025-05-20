'use client'

import Image from 'next/image'
import Link from 'next/link';

import { IoLocation } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiFacebookFill, RiInstagramFill } from "react-icons/ri";

import { OpeningHoursFooter } from '@/components/OpeningHoursFooter';
import { Container } from '@/components/Container';
import { DetailTitle } from '@/components/DetailTitle'
import { useConfigStore } from '@/store/configStore';
import { useEffect } from 'react';
import { getDiaSemana } from '@/utils/getDiaSemana';

export const Footer = () => {
  const { fetchOpeningHours, openingHours: horarios, fetchSettings, settings } = useConfigStore();

  useEffect(() => {
    fetchOpeningHours();
    fetchSettings();
  }, [])


  return (
    <Container styleRow='bg-green-principal-500 text-white'>
      <footer className='pt-12 pb-3 gap-5 flex flex-col justify-between'>
        <div className='grid md:grid-cols-3 md:py-5 gap-10'>
          <div>
            <Image src={'/logo-footer.svg'} alt='Logo do Restaurante Spumoni' width={300} height={60} />
            <p className='mt-4'>
              {settings.mensagem_rodape}
            </p>
          </div>

          <section>
            <div className='flex items-center gap-2'>
              <DetailTitle />
              <h2 className='font-bold text-lg'>Horários de Funcionamento</h2>
            </div>
            <div className='py-2'>
              {
                horarios.map((item) => (
                  <OpeningHoursFooter key={item.id}>
                    {getDiaSemana(item.dia_semana)}: {item.horario_abertura} às {item.horario_fechamento}
                    {
                      item.observacao && (<><br /><span className='text-sm'>({item.observacao})</span></>)
                    }
                  </OpeningHoursFooter>
                ))
              }
            </div>
          </section>

          <section>
            <div className='flex items-center gap-2 mb-3'>
              <DetailTitle />
              <h2 className='font-bold text-lg'>Contatos</h2>
            </div>
            <div className='flex gap-2 mt-2'>
              <IoLocation className='text-purple-principal-500 text-2xl w-7' />
              <p className='text-md w-full'>{settings.address}</p>
            </div>
            <div className='text-purple-principal-500 flex gap-2 text-2xl my-4'>
              {settings.facebook_url && (<Link href={settings.facebook_url} target='_blank'><RiFacebookFill /></Link>)}
              {settings.instagram_url && (<Link href={settings.instagram_url} target='_blank'><RiInstagramFill /></Link>)}
              {settings.whatsapp_number && (
                <Link
                  href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                >
                  <IoLogoWhatsapp />
                </Link>
              )}

            </div>
          </section>
        </div>

        <section className='flex flex-col md:flex-row gap-3 justify-between'>
          <p>Restaurante & Sorveteria Spumoni 2025. Todos os direitos reservados.</p>
          <p>Desenvolvido por <Link href={'http://www.lordsystem.com.br/'} target='_blank'>Lord System</Link>.</p>
        </section>
      </footer>
    </Container>

  )
}