import { CheckoutFormData } from "./ICheckoutForm";

export interface ValidateCheckoutParams {
  data: CheckoutFormData;
  isDelivery: boolean;
  endereco: string;
  setAddressError: (value: boolean) => void;
}
