import React from 'react'
import { FaAngleDoubleRight } from 'react-icons/fa'
import { IOpeningHoursFooter } from '@/interfaces/IOpeningHoursFooter'

export const OpeningHoursFooter = ({ children }: IOpeningHoursFooter) => {
    return (
        <div className='flex gap-2'>
            <FaAngleDoubleRight className='text-purple-principal-500 mt-1 text-lg' />
            <p>{children}</p>
        </div>
    )
}
