'use client'

import Image from 'next/image'
import Link from 'next/link';

import { OpeningHoursFooter } from '@/components/OpeningHoursFooter';
import { Container } from '@/components/Container';

import { useConfigStore } from '@/store/configStore';
import { useEffect } from 'react';
import { getDiaSemana } from '@/utils/getDiaSemana';
import { DetailTitle } from './DetailTitle';
import ContactSection from './ContactSection';

export const Footer = () => {
  const { fetchOpeningHours, openingHours: horarios, fetchSettings, settings } = useConfigStore();

  useEffect(() => {
    fetchOpeningHours();
    fetchSettings();
  }, [fetchOpeningHours, fetchSettings])


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

          <ContactSection />
        </div>

        <section className='flex flex-col md:flex-row gap-3 justify-between'>
          <p>Restaurante & Sorveteria Spumoni 2025. Todos os direitos reservados.</p>
          <p>Desenvolvido por <Link href={'http://www.lordsystem.com.br/'} target='_blank'>Lord System</Link>.</p>
        </section>
      </footer>
    </Container>

  )
}