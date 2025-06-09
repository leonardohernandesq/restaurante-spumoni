'use client'

import { useState } from 'react'
import Link from 'next/link'

import { FiXCircle } from 'react-icons/fi';

import { HamburgerButton } from './HamburgerButton';
import { BackgroundOverlay } from './BackgroundOverlay';
import { LogoutButton } from './LogoutButton';

export const AdminMenu = ({ title }: { title: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuSections = [
        {
            title: "Loja",
            links: [
                { label: "Lista de pedidos", href: "/admin/pedidos" },
                { label: "Configuração da loja", href: "/admin/config" },
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

            <HamburgerButton onClick={() => setIsOpen(true)} />
            <BackgroundOverlay isOpen={isOpen} />

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
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}
