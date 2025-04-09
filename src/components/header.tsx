'use client'

import Image from 'next/image';
import React from 'react'
import { IoWalletOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();

  const handleCart = () => {
    router.push('/carrinho')
  }


  return (
    <header className='relative max-w-full px-7 pt-5 pb-12 gap-5 flex justify-between items-center md:max-w-7xl md:m-auto bg-green-principal-500 text-white'>
      <div><Image src={'/logo-header.svg'} alt='Logo da empresa Restaurante Spumoni. Um boneco de neve e uma escrita de gelo Restaurante Spumoni' width={80} height={110} /></div>
      <div className='flex flex-col text-center gap-2'>
        <h1 className='text-md font-bold'>Restaurante <span className='text-purple-principal-700'>&</span> Sorveteria <span className='text-purple-principal-700'>Spumoni</span></h1>
        <h2 className='text-sm'>O melhor restaurante do Alto Tietê</h2>
        <div className='flex items-center justify-center'>
          <div className='bg-green-400 h-2.5 w-2.5 rounded-full mr-2'></div>
          <span className='text-md'>Aberto</span>
        </div>
      </div>
      <button onClick={() => handleCart()} className='bg-white p-3 rounded-full shadow-md'><IoWalletOutline className='text-2xl text-black' /></button>
    </header>
  )
}