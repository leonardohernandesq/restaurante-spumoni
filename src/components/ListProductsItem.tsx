'use client'

import { IProduct } from '@/interfaces/IProductAll';
import Image from 'next/image';
import { FaPencil, FaX } from 'react-icons/fa6';

interface ListProductsItemProps {
    product: IProduct;
}

export const ListProductsItem = ({ product }: ListProductsItemProps) => {
    console.log('Produto recebido:', product);

    const handleEdit = () => {
        alert(`Editando produto: ${product.name}`);
    }

    const handleDelete = () => {
        alert(`Deletando produto: ${product.name}`);
    }

    if (!product) {
        return <p>Erro ao carregar produto!</p>;
    }

    return (
        <section className='relative py-5 gap-4 flex items-center border-b border-zinc-200'>
            <div className='w-36'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${product.image_url}`}
                    className='rounded-full opacity-80'
                    alt={product.name || 'Produto inválido'}
                    width={80}
                    height={80}
                />
            </div>
            <div className='w-full'>
                <h2 className='text-lg font-medium'>{product.name}</h2>
                <p className='text-sm/4.5 text-zinc-700 mt-2 mb-1'>
                    {product.description || 'Sem descrição.'}
                </p>
                <p className='font-medium'>
                    R$ {Number(product.price).toFixed(2)}
                </p>
            </div>
            <div className='flex items-center gap-3 flex-1'>
                <button onClick={handleEdit} className='text-yellow-600 p-2 cursor-pointer'>
                    <FaPencil />
                </button>
                <button onClick={handleDelete} className='text-red-600 p-2 cursor-pointer'>
                    <FaX />
                </button>
            </div>
        </section>
    );
}
