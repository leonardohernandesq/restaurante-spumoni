import { useState, useEffect } from "react";
import { useCep } from "@/hooks/useCep";

export const useEndereco = () => {
  const { cep, setCepValue, handleCepChange } = useCep();

  // Estados de endereço
  const [endereco, setEndereco] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [errorEndereco, setErrorEndereco] = useState("");

  // Estados do formulário do modal
  const [modalEndereco, setModalEndereco] = useState("");
  const [modalNumero, setModalNumero] = useState("");
  const [modalComplemento, setModalComplemento] = useState("");
  const [modalBairro, setModalBairro] = useState("");
  const [modalCidade, setModalCidade] = useState("");
  const [modalReferencia, setModalReferencia] = useState("");

  // Limpa erro quando todos os campos obrigatórios são preenchidos
  useEffect(() => {
    if (modalEndereco && modalNumero && modalBairro && cep) {
      setErrorEndereco("");
    }
  }, [modalEndereco, modalNumero, modalBairro, cep]);

  // ========== FUNÇÕES DE MANIPULAÇÃO ==========
  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "modalEndereco":
        setModalEndereco(value);
        break;
      case "modalNumero":
        setModalNumero(value);
        break;
      case "modalComplemento":
        setModalComplemento(value);
        break;
      case "modalBairro":
        setModalBairro(value);
        break;
      case "modalReferencia":
        setModalReferencia(value);
        break;
      case "modalCidade":
        setModalCidade(value);
        break;
    }
  };

  const abrirModalEndereco = () => {
    setShowModal(true);
  };

  const limparEndereco = () => {
    setEndereco("");
    setModalEndereco("");
    setModalNumero("");
    setModalComplemento("");
    setModalBairro("");
    setModalCidade("");
    setModalReferencia("");
    setCepValue("");
    setAddressError(false);
    setErrorEndereco("");
  };

  // ========== FUNÇÃO PRINCIPAL DE SALVAR ENDEREÇO ==========

  const handleEndereco = async () => {
    // Validação de campos obrigatórios
    if (
      !modalEndereco ||
      !modalNumero ||
      !modalBairro ||
      !modalCidade ||
      !cep
    ) {
      setErrorEndereco(
        "Por favor, complete todos os campos obrigatórios: Endereço, Número, Bairro e CEP.",
      );
      return;
    }

    // Monta o endereço para exibição
    const enderecoExibicao = [
      modalEndereco,
      modalNumero,
      modalComplemento,
      modalCidade,
      modalBairro,
      cep,
    ]
      .filter(Boolean)
      .join(", ");

    const enderecoCompleto = modalReferencia
      ? `${enderecoExibicao} | ${modalReferencia}`
      : enderecoExibicao;

    setEndereco(enderecoCompleto);
    setShowModal(false);
    setAddressError(false);
  };

  // ========== RETORNO DO HOOK ==========

  return {
    // Estados principais
    endereco,
    showModal,
    setShowModal,
    addressError,
    setAddressError,
    errorEndereco,

    // Estados do formulário modal
    modalEndereco,
    setModalEndereco,
    modalNumero,
    setModalNumero,
    modalCidade,
    setModalCidade,
    modalComplemento,
    setModalComplemento,
    modalBairro,
    setModalBairro,
    modalReferencia,
    setModalReferencia,

    // Estados de CEP
    cep,
    setCepValue,

    // Funções
    abrirModalEndereco,
    handleInputChange,
    handleCepChange,
    handleEndereco,
    limparEndereco,
  };
};
