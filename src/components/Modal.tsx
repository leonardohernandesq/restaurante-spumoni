import { FiXCircle } from 'react-icons/fi'
import { IModalProps } from '@/interfaces/IModalProps'

export const Modal = ({ children, onClose }: IModalProps) => {
    const handleBackdropClick = () => {
        onClose();
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-zinc-900 opacity-80 z-40"
                onClick={handleBackdropClick}
            ></div>

            <div
                className="bg-white w-[90%] max-w-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-5 shadow-2xl rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end w-full">
                    <button onClick={handleBackdropClick}>
                        <FiXCircle size={25} className="text-zinc-700" />
                    </button>
                </div>
                <div className="mt-3">{children}</div>
            </div>
        </>
    )
}
