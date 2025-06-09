'use client'

import { useEffect } from 'react'
import { AdminMenu } from '@/components/AdminMenu'
import { Container } from '@/components/Container'
import { useConfigStore } from '@/store/configStore'
import { toast } from 'react-toastify'

interface OpeningHour {
    id?: number;
    horario_abertura: string;
    horario_fechamento: string;
    dia_semana: string;
    observacao: string;
}

const diasSemana = [
    { value: '1', label: 'Segunda' },
    { value: '2', label: 'Terça' },
    { value: '3', label: 'Quarta' },
    { value: '4', label: 'Quinta' },
    { value: '5', label: 'Sexta' },
    { value: '6', label: 'Sábado' },
    { value: '7', label: 'Domingo' }
];

const Config = () => {
    const {
        settings: storeSettings,
        setSettings,
        updateSettings,
        fetchSettings,
        fetchOpeningHours,
        createOpeningHour,
        openingHours,
        setOpeningHours
    } = useConfigStore();

    useEffect(() => {
        const load = async () => {
            await fetchSettings();
            await fetchOpeningHours();
        };
        load();
    }, [fetchSettings, fetchOpeningHours]);

    const addOpeningHour = () => {
        if (openingHours.length >= 7) {
            toast.warn('Você já adicionou todos os dias da semana.');
            return;
        }

        setOpeningHours([
            ...openingHours,
            {
                horario_abertura: '',
                horario_fechamento: '',
                dia_semana: '1',
                observacao: ''
            }
        ]);
    };

    const removeOpeningHour = (index: number) => {
        const updated = [...openingHours];
        updated.splice(index, 1);
        setOpeningHours(updated);
    };

    const updateOpeningHourField = <K extends keyof OpeningHour>(
        index: number,
        key: K,
        value: OpeningHour[K]
    ) => {
        const updated = [...openingHours];
        updated[index][key] = value;
        setOpeningHours(updated);
    };

    const handleSave = async () => {
        try {
            await updateSettings(storeSettings);

            for (const horario of openingHours) {
                await createOpeningHour(horario); // POST sempre
            }

            toast.success('Configurações salvas com sucesso!');
        } catch (err) {
            toast.error('Erro ao salvar as configurações');
            console.error(err);
        }
    };

    return (
        <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
            <div className="py-4">
                <AdminMenu title="Configurações da Loja" />
            </div>

            {/* Funcionamento */}
            <section className="py-5 flex flex-col">
                <h2 className="text-lg font-semibold mb-2">Funcionamento</h2>

                <label htmlFor="fechado_manual">Fechado manualmente?</label>
                <select
                    id="fechado_manual"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.fechado_manual ?? ''}
                    onChange={(e) => setSettings({ fechado_manual: e.target.value })}
                >
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>

                <div className="mt-6">
                    <h3 className="font-medium mb-2">Horários por Dia</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        {openingHours.map((item, index) => {
                            const usedDays = openingHours
                                .map((h, i) => i !== index && h.dia_semana)
                                .filter(Boolean);
                            const diasDisponiveis = diasSemana.filter(
                                (d) => d.value === item.dia_semana || !usedDays.includes(d.value)
                            );

                            return (
                                <div key={index} className="border border-zinc-300 p-3 rounded-md bg-zinc-100">
                                    <label htmlFor={`horario_abertura_${index}`}>Horário de Abertura</label>
                                    <input
                                        type="time"
                                        id={`horario_abertura_${index}`}
                                        className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 w-full"
                                        value={item.horario_abertura ?? ''}
                                        onChange={(e) => updateOpeningHourField(index, 'horario_abertura', e.target.value)}
                                    />

                                    <label className="mt-3" htmlFor={`horario_fechamento_${index}`}>Horário de Fechamento</label>
                                    <input
                                        type="time"
                                        id={`horario_fechamento_${index}`}
                                        className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 w-full"
                                        value={item.horario_fechamento ?? ''}
                                        onChange={(e) => updateOpeningHourField(index, 'horario_fechamento', e.target.value)}
                                    />

                                    <label className="mt-3" htmlFor={`dia_semana_${index}`}>Dia da Semana</label>
                                    <select
                                        id={`dia_semana_${index}`}
                                        className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 w-full"
                                        value={item.dia_semana}
                                        onChange={(e) => updateOpeningHourField(index, 'dia_semana', e.target.value)}
                                    >
                                        {diasDisponiveis.map((dia) => (
                                            <option key={dia.value} value={dia.value}>
                                                {dia.label}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="mt-3" htmlFor={`observacao_${index}`}>Observação</label>
                                    <textarea
                                        id={`observacao_${index}`}
                                        className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0 w-full"
                                        value={item.observacao ?? ''}
                                        onChange={(e) => updateOpeningHourField(index, 'observacao', e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        className="mt-4 text-red-600 font-medium underline cursor-pointer"
                                        onClick={() => removeOpeningHour(index)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={addOpeningHour}
                        type="button"
                        className="mt-4 px-4 py-2 bg-purple-principal-700 text-white rounded-md w-fit cursor-pointer"
                    >
                        + Adicionar Horário
                    </button>
                </div>
            </section>

            {/* Contato */}
            <section className="py-5 flex flex-col border-t border-zinc-300">
                <h2 className="text-lg font-semibold mb-2">Contato</h2>

                <label htmlFor="whatsapp_number">WhatsApp</label>
                <input
                    id="whatsapp_number"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.whatsapp_number ?? ''}
                    onChange={(e) => setSettings({ whatsapp_number: e.target.value })}
                />

                <label htmlFor="phone_number">Telefone</label>
                <input
                    id="phone_number"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.phone_number ?? ''}
                    onChange={(e) => setSettings({ phone_number: e.target.value })}
                />

                <label htmlFor="address">Endereço</label>
                <input
                    id="address"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.address ?? ''}
                    onChange={(e) => setSettings({ address: e.target.value })}
                />
            </section>

            {/* Mídias Sociais */}
            <section className="py-5 flex flex-col border-t border-zinc-300">
                <h2 className="text-lg font-semibold mb-2">Mídias Sociais</h2>

                <label htmlFor="facebook_url">Facebook</label>
                <input
                    id="facebook_url"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.facebook_url ?? ''}
                    onChange={(e) => setSettings({ facebook_url: e.target.value })}
                />

                <label htmlFor="instagram_url">Instagram</label>
                <input
                    id="instagram_url"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.instagram_url ?? ''}
                    onChange={(e) => setSettings({ instagram_url: e.target.value })}
                />
            </section>

            {/* Impressão & Rodapé */}
            <section className="py-5 flex flex-col border-t border-zinc-300">
                <h2 className="text-lg font-semibold mb-2">Impressão & Rodapé</h2>

                <label htmlFor="tamanho_bobina">Tamanho da Bobina</label>
                <input
                    id="tamanho_bobina"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.tamanho_bobina ?? ''}
                    onChange={(e) => setSettings({ tamanho_bobina: e.target.value })}
                />

                <label htmlFor="mensagem_rodape">Mensagem no rodapé</label>
                <textarea
                    id="mensagem_rodape"
                    className="bg-zinc-200 border border-zinc-300 py-1.5 px-3 outline-0"
                    value={storeSettings.mensagem_rodape ?? ''}
                    onChange={(e) => setSettings({ mensagem_rodape: e.target.value })}
                />
            </section>

            <button
                onClick={handleSave}
                className="w-fit px-4 font-medium text-white py-2 rounded-md mb-6 bg-purple-principal-700 cursor-pointer"
            >
                SALVAR CONFIGURAÇÕES
            </button>
        </Container>
    );
};

export default Config;
