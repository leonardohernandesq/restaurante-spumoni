import Link from 'next/link'
import React from 'react'

const CategoryScroll = () => {
    const linkActive = 2;

    return (
        <div className="block overflow-x-auto px-6 pt-3 pb-4 bg-zinc-100 mt-[-20] z-50 relative rounded-t-2xl">
            <div className='xl:max-w-7xl xl:mx-auto'>
                <div className="flex gap-4 w-max">
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 1 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 1 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 2 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 2 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 3 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 3 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 4 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 4 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 5 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 5 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 6 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 6 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 7 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 7 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 8 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 8 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 9 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 9 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                    <Link href={'#pratos-do-dia'} title="Pratos do Dia" className={`${linkActive == 10 ? 'text-black' : 'text-zinc-400'}`}>Pratos do Dia {linkActive == 10 && <div className="h-[2px] w-full bg-purple-principal-500"></div>}</Link>
                </div>
            </div>
        </div>
    )
}

export default CategoryScroll