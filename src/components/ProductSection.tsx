import React from 'react'
import { ProductCard } from './ProductCard'
import { IProductAll } from '@/interfaces/IProductAll'
import Container from './Container'

interface ProductSectionProps {
    data: IProductAll[]
}

export const ProductSection = ({ data }: ProductSectionProps) => {
    return (
        <>
            {
                data.map((item) => (
                    <Container key={item.id}>
                        <section className="py-7">
                            <div className="text-center pb-6">
                                <h2 className="font-medium text-3xl">{item.category}</h2>
                                <p className='text-zinc-700'>{item.descriptionCategory}</p>
                            </div>
                            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-2'>
                                {item.products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </section>
                    </Container>
                ))
            }
        </>

    )
}