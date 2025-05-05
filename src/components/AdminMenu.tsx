'use client'

import { userStore } from '@/store/userStore';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { CgMenuLeft } from 'react-icons/cg'
import { FiLogOut, FiXCircle } from 'react-icons/fi';

export const AdminMenu = ({ title }: { title: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, clearUser } = userStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        clearUser();
        router.push('/admin');
    };

    const menuSections = [
        {
            title: "Pedidos",
            links: [
                { label: "Lista de pedidos", href: "/admin/pedidos" },
            ],
        },
        {
            title: "Produtos",
            links: [
                { label: "Lista de Produtos", href: "/admin/listarprodutos" },
                { label: "Adicionar Produtos", href: "/admin/adicionarprodutos" },
            ],
        },
        {
            title: "Categorias",
            links: [
                { label: "Lista de Categorias", href: "/admin/listarcategorias" },
                { label: "Adicionar Categorias", href: "/admin/adicionarcategorias" },
            ],
        },
    ];


    return (
        <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-principal-700">{title}</h1>

            <button className='cursor-pointer transition-all' onClick={() => setIsOpen(true)}>
                <CgMenuLeft size={25} />
            </button>

            <div className={`bg-zinc-900 fixed right-0 top-0 w-full h-screen z-40 opacity-70 ${isOpen ? 'block' : 'hidden'}`}></div>
            <div className={`fixed right-0 top-0 w-96 h-screen bg-white z-50 ${isOpen ? 'block' : 'hidden'}`}>
                <div className='p-4'>
                    <button onClick={() => setIsOpen(!isOpen)} className='fixed right-3 top-3 text-zinc-400 cursor-pointer mb-4'><FiXCircle size={30} /></button>
                    <ul className="space-y-2 mt-8">
                        {menuSections.map((section, idx) => (
                            <li key={idx}>
                                <strong className="block text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                                    {section.title}
                                </strong>

                                <ul className="mt-2 space-y-1">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link
                                                href={link.href}
                                                className={`block rounded-lg px-4 py-2 text-sm font-medium transition text-gray-900 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200`}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => handleLogout()} className={`flex items-center gap-3 absolute right-4 bottom-2 text-left rounded-lg px-4 py-2 text-sm font-medium transition text-red-700 hover:bg-red-700 hover:text-gray-100 cursor-pointer opacity-70 hover:opacity-100`}>
                        <FiLogOut size={20} />
                        Sair da conta
                    </button>
                </div>
            </div>
        </header>
    )
}
