'use client'

import { useState } from 'react';
import Link from 'next/link';
import { IPropsCategory } from '@/interfaces/ICategory';

export const CategoryScroll = ({ categories }: IPropsCategory) => {
    const [linkActive, setLinkActive] = useState(0);

    const handleScrollLink = (item: number) => {
        setLinkActive(item);
    }

    return (
        <div className="block overflow-x-auto pt-3 pb-4 px-2 bg-zinc-100 mt-[-20] md:mt-0 z-50 relative rounded-t-2xl">
            <div className='xl:max-w-7xl xl:mx-auto'>
                <div className="flex gap-4 w-max">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            onClick={() => handleScrollLink(index)}
                            href={`#${category.slug}`}
                            title={category.descricao}
                            className={`${linkActive === index ? 'text-black' : 'text-zinc-400'}`}
                        >
                            {category.nome}
                            {linkActive === index && (
                                <div className="h-[2px] w-full bg-purple-principal-500"></div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};