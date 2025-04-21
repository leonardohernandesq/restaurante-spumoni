import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
const LoadingIcon = ({ color }: { color?: string }) => {
    return (
        <AiOutlineLoading3Quarters className={`animate-spin ${color ? color : 'text-white'}`} size={25} />
    )
}

export default LoadingIcon