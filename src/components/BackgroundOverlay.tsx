import React from 'react'

export const BackgroundOverlay = ({ isOpen }: { isOpen: boolean }) => {
    return (
        <div className={`bg-zinc-900 fixed right-0 top-0 w-full h-screen z-40 opacity-70 ${isOpen ? 'block' : 'hidden'}`}></div>

    )
}
