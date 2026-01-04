export const CheckoutClientData = ({
  nome,
  telefone,
}: {
  nome?: string;
  telefone?: string;
}) => (
  <div className="flex flex-col px-4 py-2">
    <h2 className="font-bold text-purple-principal-700 text-lg">
      Dados do cliente
    </h2>
    {nome && (
      <p>
        <strong>Nome:</strong> {nome}
      </p>
    )}
    {telefone && (
      <p>
        <strong>Telefone:</strong> {telefone}
      </p>
    )}
  </div>
);
