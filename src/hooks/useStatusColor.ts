import {
  PEDIDO_STATUS,
  PEDIDO_STATUS_LIST,
  PedidoStatus,
  getStatusColor,
  getStatusLabel,
} from "@/domain/pedidoStatus";

export type StatusKey = PedidoStatus;

const statusOptions = PEDIDO_STATUS_LIST.map((id) => ({
  id,
  label: PEDIDO_STATUS[id].label,
}));

/** Mantido para compatibilidade; a fonte dos dados é `domain/pedidoStatus`. */
export function useStatusColor() {
  return {
    statusMap: PEDIDO_STATUS,
    statusOptions,
    getLabel: getStatusLabel,
    getColor: getStatusColor,
  };
}
