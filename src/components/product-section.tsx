import React from 'react'
import { ProductCard } from './product-card'
import { IProductAll } from '@/interfaces/IProductAll'

interface ProductSectionProps {
    data: IProductAll[]
}

export const ProductSection = ({ data }: ProductSectionProps) => {
    return (
        <>
            {
                data.map((item) => (
                    <section key={item.id} className="py-7">
                        <div className="text-center px-14">
                            <h2 className="font-medium text-3xl">{item.category}</h2>
                            <p className='text-zinc-700'>{item.descriptionCategory}</p>
                        </div>
                        <div>
                            {item.products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                ))
            }
        </>

    )
}