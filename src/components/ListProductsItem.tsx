'use client'

import Image from 'next/image'
import { FaPencil, FaX } from 'react-icons/fa6'

const ListProductsItem = () => {
    const handleEdit = () => {
        alert('Editando');
    }

    const handleDelete = () => {
        alert('Deletando');
    }


    return (
        <section className='relative py-5 gap-4 flex items-center border-b border-zinc-200'>
            <div className='w-36'>
                <Image src={'/prato.png'} className='rounded-full opacity-80' alt='Nome Do Prato Aqui' width={80} height={80} />
            </div>
            <div className='w-full'>
                <h2 className='text-lg font-medium'>(Quinta-feira) - Bife Acebolado</h2>
                <p className='text-sm/4.5 text-zinc-700 mt-2 mb-1'>Suculento bife acebolado grelhado na chapa, acompanhado de arroz soltinho, feijão caseiro temperado na medida certa...</p>
                <p className='font-medium'>R$ 00,00</p>
            </div>
            <div className='flex items-center gap-3 flex-1'>
                <button onClick={() => handleEdit()} className='text-yellow-600 p-2'>
                    <FaPencil />
                </button>
                <button onClick={() => handleDelete()} className='text-red-600 p-2'>
                    <FaX />
                </button>
            </div>
        </section>
    )
}

export default ListProductsItem