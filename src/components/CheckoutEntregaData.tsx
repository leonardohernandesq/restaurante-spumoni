export const CheckoutEntregaData = ({
  tipo_entrega,
  data_entrega,
  entrega,
}: {
  tipo_entrega?: string;
  data_entrega?: string;
  entrega?: string;
}) => {
  const tipo = tipo_entrega === "delivery" ? "entrega" : "retirada";
  const dataFormatada = data_entrega
    ? new Date(data_entrega).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="flex flex-col border-t border-zinc-300 px-4 pt-2">
      <h2 className="font-bold text-purple-principal-700 text-lg">
        Dados de {tipo}:
      </h2>
      <p>
        <strong>Tipo de {tipo}:</strong>{" "}
        {entrega === "now" ? "Para agora" : "Agendada"}
      </p>
      {entrega === "booking" && (
        <p>
          <strong>Data e hora da {tipo}:</strong> {dataFormatada}
        </p>
      )}
    </div>
  );
};
