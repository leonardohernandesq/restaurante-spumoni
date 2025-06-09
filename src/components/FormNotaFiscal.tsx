'use client'

interface FormNotaFiscalProps {
    nf: string;
    setNf: (value: string) => void;
}

export const FormNotaFiscal = ({ nf, setNf }: FormNotaFiscalProps) => {
    return (
        <section className="flex flex-col border-b border-zinc-200 pb-4">
            <label htmlFor="nota-fiscal" className="mb-2">CPF OU CNPJ NA NOTA</label>
            <input
                value={nf}
                onChange={(e) => setNf(e.target.value)}
                name="nota-fiscal"
                id="nota-fiscal"
                type="text"
                placeholder="XXX.XXX.XXX-XX"
                className="w-full p-2 border border-zinc-400 rounded-md"
            />
        </section>
    )
}
