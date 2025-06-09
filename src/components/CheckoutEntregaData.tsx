import { IPedido } from "@/interfaces/IPedidosData";

export const CheckoutEntregaData = ({ pedido }: { pedido: IPedido | null }) => {
  const tipo = pedido?.tipo_entrega === 'delivery' ? 'entrega' : 'retirada';
  const dataFormatada = pedido?.data_entrega
    ? new Date(pedido.data_entrega).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '';

  return (
    <div className='flex flex-col border-t border-zinc-300 px-4 pt-2'>
      <h2 className='font-bold text-purple-principal-700 text-lg'>Dados de {tipo}:</h2>
      <p><strong>Tipo de {tipo}:</strong> {pedido?.entrega === 'now' ? 'Para agora' : 'Agendada'}</p>
      <p>{dataFormatada}</p>
    </div>
  );
};
