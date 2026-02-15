export interface IBookingInputs {
    entrega: string,
    delivery: string,
    setEntrega: (type: 'booking' | 'now') => void;
    bookingDate: string,
    handleChangeBookingDate: (e: string) => void,
}
