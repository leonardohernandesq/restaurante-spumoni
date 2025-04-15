'use client'

import { FaArrowLeft } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

export const HeaderPages = ({ title }: { title: string }) => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    return (
        <header className='relative py-5 gap-4 flex items-center'>
            <button className='p-2 bg-white rounded-full cursor-pointer' onClick={handleBack}>
                <FaArrowLeft />
            </button>
            <h1>{title}</h1>
        </header>
    )
}