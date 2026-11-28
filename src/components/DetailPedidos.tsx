import { useStatusColor } from "@/hooks/useStatusColor";

/** Faixa na lateral esquerda do pedido, com a cor do status. */
export const DetailPedidos = ({ status }: { status: number }) => {
  const { getColor } = useStatusColor();

  return <div aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${getColor(status)}`} />;
};
