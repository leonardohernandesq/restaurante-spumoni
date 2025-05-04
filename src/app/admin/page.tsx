'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BsArrowRight } from 'react-icons/bs'
import { toast } from 'react-toastify'

import { Container } from '@/components/Container'
import { userStore } from '@/store/userStore';
import { LoadingIcon } from '@/components/LoadingIcon'

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { login, loading } = userStore();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !senha) {
            toast.error('Verifique os dados informados');
            return;
        }

        try {
            await login(email, senha);

            toast.success('Login realizado com sucesso!');

            router.push('/admin/pedidos')
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || 'Erro ao fazer login';
            toast.error(serverMsg);
        }
    };

    return (
        <Container styleRow='bg-green-principal-500'>
            <main className='flex flex-col items-center justify-center min-h-screen px-7 py-5 '>
                <Link href={'/'}><Image src={'logo-footer.svg'} alt='Logo do Restaurante Spumoni' width={300} height={100} /></Link>
                <section className='flex flex-col text-center text-white my-10 bg-green-principal-900 p-8 w-full max-w-lg gap-5 rounded-3xl shadow-2xl'>
                    <h1 className='text-5xl font-bold'>Login</h1>
                    <h2 className=''>Acesse sua lista de pedidos.</h2>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='bg-green-950 py-2.5 px-5 placeholder:text-zinc-400 rounded-xl' placeholder='Digite seu usuário: ' />
                    <input value={senha} onChange={(e) => setSenha(e.target.value)} type="text" className='bg-green-950 py-2.5 px-5 placeholder:text-zinc-400 rounded-xl' placeholder='Digite sua senha: ' />
                    <button className='bg-purple-principal-700 py-2.5 px-5 rounded-xl font-medium flex items-center justify-center gap-3 cursor-pointer' onClick={() => handleLogin()}>{loading ? <LoadingIcon /> : <>LOGIN <BsArrowRight /></>} </button>
                </section>
            </main>
        </Container>
    )
}

export default Login