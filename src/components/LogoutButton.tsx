import React from 'react'
import { useRouter } from 'next/navigation';

import { userStore } from '@/store/userStore';
import { FiLogOut } from 'react-icons/fi'

export const LogoutButton = () => {
    const { logout, clearUser } = userStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        clearUser();
        router.push('/admin');
    };

    return (
        <button onClick={() => handleLogout()} className={`flex items-center gap-3 absolute right-4 bottom-2 text-left rounded-lg px-4 py-2 text-sm font-medium transition text-red-700 hover:bg-red-700 hover:text-gray-100 cursor-pointer opacity-70 hover:opacity-100`}>
            <FiLogOut size={20} />
            Sair da conta
        </button>
    )
}