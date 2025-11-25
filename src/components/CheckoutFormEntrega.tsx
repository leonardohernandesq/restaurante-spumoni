import { DeliveryOptions } from "./DeliveryOptions";
import { EnderecoModal } from "./EnderecoModal";
import { BookingInputs } from "./BookingInputs";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CheckoutFormData } from "@/interfaces/ICheckoutForm";

interface CheckoutFormEntregaProps {
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  handleChangeBookingDate: (value: string) => void;
  enderecoHook: {
    endereco: string;
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    handleEndereco: () => void;
    preencherEnderecoAutomaticamente: () => void;
    errorEndereco: string;
    addressError: boolean;
    modalEndereco: string;
    setModalEndereco: (value: string) => void;
    modalNumero: string;
    abrirModalEndereco: () => void;
    setModalNumero: (value: string) => void;
    modalComplemento: string;
    setModalComplemento: (value: string) => void;
    modalBairro: string;
    setModalBairro: (value: string) => void;
    cep: string;
    setCepValue: (value: string) => void;
    modalReferencia: string;
    handleInputChange: (field: string, value: string) => void;
    handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  loja: string;
}

export const CheckoutFormEntrega = ({
  watch,
  setValue,
  handleChangeBookingDate,
  enderecoHook,
  loja,
}: CheckoutFormEntregaProps) => {
  const delivery = watch("tipo_entrega");
  const entrega = watch("entrega");
  const bookingDate = watch("data_entrega");

  return (
    <>
      <DeliveryOptions
        delivery={delivery}
        setDelivery={(value) => setValue("tipo_entrega", value)}
      />

      <EnderecoModal
        endereco={enderecoHook.endereco}
        delivery={delivery}
        showModal={enderecoHook.showModal}
        setShowModal={enderecoHook.setShowModal}
        handleEndereco={enderecoHook.handleEndereco}
        preencherEnderecoAutomaticamente={
          enderecoHook.preencherEnderecoAutomaticamente
        }
        errorEndereco={enderecoHook.errorEndereco}
        addressError={enderecoHook.addressError}
        modalEndereco={enderecoHook.modalEndereco}
        setModalEndereco={enderecoHook.setModalEndereco}
        modalNumero={enderecoHook.modalNumero}
        abrirModalEndereco={enderecoHook.abrirModalEndereco}
        setModalNumero={enderecoHook.setModalNumero}
        modalComplemento={enderecoHook.modalComplemento}
        setModalComplemento={enderecoHook.setModalComplemento}
        modalBairro={enderecoHook.modalBairro}
        setModalBairro={enderecoHook.setModalBairro}
        cep={enderecoHook.cep}
        setCepValue={enderecoHook.setCepValue}
        modalReferencia={enderecoHook.modalReferencia}
        handleInputChange={enderecoHook.handleInputChange}
        handleCepChange={enderecoHook.handleCepChange}
        loja={loja}
      />

      <BookingInputs
        entrega={entrega}
        setEntrega={(value) => setValue("entrega", value)}
        delivery={delivery}
        bookingDate={bookingDate || ""}
        handleChangeBookingDate={handleChangeBookingDate}
      />
    </>
  );
};
