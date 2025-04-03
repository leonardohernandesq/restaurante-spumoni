import Image from 'next/image';
import React from 'react'
import { IoWalletOutline } from "react-icons/io5";

export const Header = () => {
  return (
    <header className='max-w-full p-3 flex justify-between items-center md:max-w-7xl md:m-auto'>
      <div><Image src={'/logo-header.svg'} alt='Logo da empresa Restaurante Spumoni. Um boneco de neve e uma escrita de gelo Restaurante Spumoni' width={70} height={100} /></div>
      <div className='text-center'>
        <h1 className='text-lg'>Restaurante <span className='text-purple-principal-700'>&</span> Sorveteria <span className='text-purple-principal-700'>Spumoni</span></h1>
        <h2>O melhor restaurante do Alto Tietê</h2>
        <div className='flex items-center justify-center'>
          <div className='bg-green-600 h-5 w-5 rounded-full mr-2'></div>
          <span>Aberto</span>
        </div>
      </div>
      <div className='bg-white p-4 rounded-full shadow-md'><IoWalletOutline className='text-2xl text-black' /></div>
    </header>
  )
}