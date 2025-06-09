import { useState } from 'react';

export const useLocalizacao = () => {
    const [distancia, setDistancia] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    const buscarLocalizacao = async () => {
        setCarregando(true);
        setErro(null);

        if (!navigator.geolocation) {
            setErro('Geolocalização não suportada.');
            setCarregando(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                fetch(
                    `https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf6248f2b806cf974d4026a7421623106b935b&point.lon=${longitude}&point.lat=${latitude}`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.features && data.features.length > 0) {
                            const endereco = data.features[0].properties;
                            setDistancia(`${endereco.street}, ${endereco.city}`);
                        } else {
                            setErro('Endereço não encontrado.');
                        }
                    })
                    .catch(() => setErro('Erro ao buscar o endereço.'));

                setCarregando(false);
            },
            (err) => {
                setErro(`Erro de geolocalização: ${err.message}`);
                setCarregando(false);
            }
        );
    };

    return {
        distancia,
        erro,
        carregando,
        buscarLocalizacao,
    };
};
