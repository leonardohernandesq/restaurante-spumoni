// components/printer.tsx
import React from 'react';

const NfPrint = () => {
    return (
        <div id="print-area" className="hidden print:block text-sm font-mono p-4">
            <h2 className="text-center font-bold text-base">Empresa Exemplo LTDA</h2>
            <p>CNPJ: 00.000.000/0001-00</p>
            <p>Endereço: Rua Exemplo, 123 - Centro</p>
            <hr className="my-2 border" />
            <p><strong>Cliente:</strong> Felipe</p>
            <p><strong>Endereço:</strong> Rua Logo Ali, 2000 - Poá, SP - 09663-000</p>
            <p><strong>Pedido:</strong> Bife Acebolado - Grande</p>
            <p><strong>Talheres:</strong> Sim</p>
            <p><strong>Forma de pagamento:</strong> PIX</p>
            <hr className="my-2 border" />
            <p className="text-right font-semibold">Total: R$ 00,00</p>
            <p className="text-center mt-4">Obrigado pela preferência!</p>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-area, #print-area * {
                        visibility: visible;
                    }
                    #print-area {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 76mm;
                        padding: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default NfPrint;
