import { useState } from 'react';

export const useCep = () => {
    const [cep, setCep] = useState('');

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');

        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        if (value.length > 9) {
            value = value.slice(0, 9);
        }

        setCep(value);
    };

    return { cep, handleCepChange };
};
