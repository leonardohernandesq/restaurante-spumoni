'use client'

import Image from 'next/image'
import React from 'react'
import { BsArrowRight } from 'react-icons/bs'

const Login = () => {
    const handleLogin = () => {
        alert('Logando....')
    }

    return (
        <main className='flex flex-col items-center justify-center h-screen bg-green-principal-500 px-7 py-5 '>
            <Image src={'logo-footer.svg'} alt='Logo do Restaurante Spumoni' width={300} height={100} />
            <section className='flex flex-col text-center text-white my-10 bg-green-principal-900 p-8 w-full gap-5 rounded-3xl shadow-2xl'>
                <h1 className='text-5xl font-bold'>Login</h1>
                <h2 className=''>Acesse sua lista de pedidos.</h2>
                <input type="text" className='bg-green-950 py-2.5 px-5 placeholder:text-zinc-400 rounded-xl' placeholder='Digite seu usuário: ' />
                <input type="text" className='bg-green-950 py-2.5 px-5 placeholder:text-zinc-400 rounded-xl' placeholder='Digite sua senha: ' />
                <button className='bg-purple-principal-700 py-2.5 px-5 rounded-xl font-medium flex items-center justify-center gap-3' onClick={() => handleLogin()}>LOGIN <BsArrowRight /> </button>
            </section>
        </main>
    )
}

export default Login