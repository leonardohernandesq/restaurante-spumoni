import { toast } from "react-toastify";

export const validateBookingDate = (
  value: string,
  setValue: (field: "data_entrega", value: string) => void
) => {
  const bookingDate = new Date(value);
  const now = new Date();

  if (bookingDate < now) {
    toast.error("A data não pode ser no passado");
    return;
  }

  const hour = bookingDate.getHours();

  // TODO: Ajustar horário comercial conforme necessidade
  if (hour < 9 || hour >= 18) {
    toast.error("Insira um horário válido entre 9:00 e 18:00");
    return;
  }

  if (
    bookingDate.toDateString() === now.toDateString() &&
    hour <= now.getHours()
  ) {
    toast.error("Escolha um horário futuro para hoje");
    return;
  }

  setValue("data_entrega", value);
};
