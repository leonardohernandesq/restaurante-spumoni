'use client'

import { IProduct } from '@/interfaces/IProductAll';
import { productStore } from '@/store/produtoStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaPencil, FaX } from 'react-icons/fa6';
import { toast } from 'react-toastify';


interface ListProductsItemProps {
    product: IProduct;
}

export const ListProductsItem = ({ product }: ListProductsItemProps) => {
    const { deleteProductApi, loading } = productStore();
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/admin/editarprodutos/${product.slug}`)
    }

    const handleDelete = async (id: string | number) => {
        await deleteProductApi(id);
        toast.success(`Produto ${product.name} foi eliminado com sucesso!`);
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
                    {product.description}
                </p>
                <p className='font-medium'>
                    R$ {Number(product.price).toFixed(2)}
                </p>
            </div>
            <div className='flex items-center gap-3 flex-1'>
                <button onClick={handleEdit} className='text-yellow-600 p-2 cursor-pointer'>
                    <FaPencil />
                </button>
                <button onClick={() => handleDelete(product.id)} className='text-red-600 p-2 cursor-pointer'>
                    <FaX />
                </button>
            </div>
        </section>
    );
}
