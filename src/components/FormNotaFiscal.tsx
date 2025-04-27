'use client'

export const FormNotaFiscal = () => {
    return (
        <section className="flex flex-col border-b border-zinc-200 pb-4">
            <label htmlFor="nota-fiscal" className="mb-2">CPF OU CNPJ NA NOTA</label>
            <input name="nota-fiscal" id="nota-fiscal" type="text" placeholder="XXX.XXX.XXX-XX" className="w-full p-2 border border-zinc-400 rounded-md" />
        </section>
    )
}

export default FormNotaFiscal
