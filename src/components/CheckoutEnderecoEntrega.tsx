import { IPedido } from "@/interfaces/IPedidosData";
import { formatCurrencyBRL } from "@/utils/validators";

export const CheckoutEnderecoEntrega = ({
  pedido,
  restaurantAddress,
}: {
  pedido: IPedido | null;
  restaurantAddress?: string;
}) => {
  if (pedido?.tipo_entrega === "delivery") {
    return (
      <div className="flex flex-col px-4 pb-2">
        <p>
          <strong>Endereço de Entrega:</strong> {pedido?.endereco_entrega},{" "}
          {pedido?.numero} {pedido?.complemento} - {pedido?.bairro} | CEP:{" "}
          {pedido?.cep} | {pedido?.referencia}
        </p>
        <p>
          <strong>Taxa de Entrega:</strong>{" "}
          {formatCurrencyBRL(Number(pedido?.taxa_entrega))}
        </p>
      </div>
    );
  }

  if (pedido?.tipo_entrega === "takeaway") {
    return (
      <div className="flex flex-col px-4 pb-2">
        <p>
          <strong>Retirar em loja no endereço:</strong> {restaurantAddress}
        </p>
      </div>
    );
  }

  return null;
};
