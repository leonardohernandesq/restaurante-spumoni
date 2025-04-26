import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export const LoadingIcon = ({ color }: { color?: string }) => {
    return (
        <AiOutlineLoading3Quarters className={`animate-spin ${color ? color : 'text-white'}`} size={25} />
    )
}