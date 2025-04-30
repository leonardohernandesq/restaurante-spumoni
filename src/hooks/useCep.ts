import { useState } from 'react';

export const useCep = () => {
    const [cep, setCep] = useState('');

    const formatCep = (value: string) => {
        value = value.replace(/\D/g, '');

        if (value.length >= 4 && value.length <= 7) {
            if (value.length > 4) {
                value = value.slice(0, 4) + '-' + value.slice(4);
            }
        } else if (value.length > 7) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }

        return value.slice(0, 8);
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCep(e.target.value);
        setCep(formattedValue);
    };

    const setCepValue = (value: string) => {
        const formattedValue = formatCep(value);
        setCep(formattedValue);
    };

    return { cep, handleCepChange, setCepValue };
};
