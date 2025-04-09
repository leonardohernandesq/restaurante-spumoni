import { IProduct } from '@/interfaces/IProductAll'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BiPlus } from 'react-icons/bi'

interface ProductSectionProps {
    product: IProduct
}


export const ProductCard = ({ product }: ProductSectionProps) => {
    return (
        <section className='max-w-full mx-7 mt-5 mb-12 flex flex-col items-center md:max-w-7xl md:m-auto bg-white rounded-xl shadow-lg'>
            <div className='bg-purple-principal-500 h-32 w-full rounded-t-xl relative flex items-center justify-center'>
                <Image src={`/${product.image}`} alt='Prato do dia - Filé de Frango Grelhado' width={150} height={150} className='absolute -bottom-14' />
            </div>
            <div className='px-4 pt-16 pb-4'>
                <h2 className='font-medium text-2xl mb-2'>{product.name}</h2>
                <p className='text-zinc-700'>
                    {product.description}
                </p>
                <section className='flex justify-between items-center mt-6'>
                    <div className='text-lg font-medium text-green-principal-900'>
                        R$ {product.price}
                    </div>
                    <Link href={`/produto/${product.slug}`} prefetch>
                        <div className='bg-purple-principal-500 flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md shadow-zinc-400 pointer'>
                            <BiPlus size={18} />
                        </div>
                    </Link>
                </section>
            </div>
        </section>
    )
}