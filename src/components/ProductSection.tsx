import { ProductCard } from '@/components/ProductCard'
import { Container } from '@/components/Container'

import { IProductSectionProps } from '@/interfaces/IProductSectionProps'

export const ProductSection = ({ data }: IProductSectionProps) => {
    console.log(data);
    return (
        <>
            {data.map((item) => (
                <Container key={item.id}>
                    <section id={item.slug} className="py-6">
                        <div className="text-center pb-6">
                            <h2 className="font-medium text-3xl mb-3">{item.category}</h2>
                            <p className='text-zinc-700 max-w-4xl m-auto'>{item.descriptionCategory}</p>
                        </div>
                        <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-2'>
                            {item.products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                </Container>
            ))}
        </>
    )
}
