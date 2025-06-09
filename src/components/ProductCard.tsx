'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { BiPlus } from 'react-icons/bi'

import { IProductCardProps } from '@/interfaces/IProductCardProps'

import { useStoreStatus } from '@/hooks/useStoreStatus';


export const ProductCard = ({ product }: IProductCardProps) => {
    const { storeOpen } = useStoreStatus();
    const router = useRouter();

    const handleBuyProduct = (link: string) => {
        if (storeOpen) {
            router.push(link);
        } else {
            toast.error('A Loja está fechada no momento. \n Tente novamente mais tarde!')
        }
    }

    return (
        <section className='bg-white rounded-xl shadow-lg'>
            <div className='bg-purple-principal-500 h-32 w-full rounded-t-xl relative flex items-center justify-center cursor-pointer' title={product.name} onClick={() => handleBuyProduct(`/produto/${product.slug}`)}>
                <Image src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${product.image_url}`} alt={product.name} width={150} height={150} className='absolute -bottom-14' />

            </div>
            <div className='px-4 pt-16 pb-4 flex flex-col justify-between'>
                <div>
                    <h2 className='font-medium text-2xl mb-2'>{product.name}</h2>
                    <p className='text-zinc-700 md:min-h-20'>
                        {product.description}
                    </p>
                </div>
                <section className='flex justify-between items-center mt-6'>
                    <div className='text-lg font-medium text-green-principal-900'>
                        Desde R${product.price}
                    </div>
                    <button onClick={() => handleBuyProduct(`/produto/${product.slug}`)} title='Adicionar ao carrinho'>
                        <div className='bg-purple-principal-500 flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md shadow-zinc-400 cursor-pointer'>
                            <BiPlus size={18} />
                        </div>
                    </button>
                </section>
            </div>
        </section>
    )
}