import { IBookingInputs } from '@/interfaces/IBookingInput'

export const BookingInputs = ({ entrega, delivery, setEntrega, bookingDate, handleChangeBookingDate }: IBookingInputs) => {
    return (
        <div className='flex flex-col gap-2 pt-2 pb-5 border-b border-zinc-200'>
            <div className='flex items-center gap-2'>
                <input id='deliverynow' name='entrega' type='radio' checked={entrega === 'now'} onChange={() => setEntrega('now')} />
                <label className='text-lg' htmlFor="now">{delivery === 'delivery' ? 'Entregar agora' : 'Retirar agora'}</label>
            </div>
            <div className='flex items-center gap-2'>
                <input id='booking' name='entrega' type='radio' checked={entrega === 'booking'} onChange={() => setEntrega('booking')} />
                <label className='text-lg' htmlFor="booking">{delivery === 'delivery' ? 'Agendar entrega' : 'Agendar retirada'}</label>
            </div>

            {entrega === 'booking' &&
                <div className='flex items-center p-2 pb-0 border border-zinc-400 rounded-md w-fit'>
                    <input className='mb-2 cursor-pointer' type='datetime-local' value={bookingDate} onChange={(e) => handleChangeBookingDate(e.target.value)} />
                </div>
            }
        </div>
    )
}