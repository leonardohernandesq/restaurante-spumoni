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
    setModalReferencia("");
    setCepValue("");
    setAddressError(false);
    setErrorEndereco("");
  };

  // ========== FUNÇÃO PRINCIPAL DE SALVAR ENDEREÇO ==========

  const handleEndereco = async () => {
    // Validação de campos obrigatórios
    if (!modalEndereco || !modalNumero || !modalBairro || !cep) {
      setErrorEndereco(
        "Por favor, complete todos os campos obrigatórios: Endereço, Número, Bairro e CEP."
      );
      return;
    }

    // Monta o endereço para exibição
    const enderecoExibicao = [
      modalEndereco,
      modalNumero,
      modalComplemento,
      modalBairro,
      cep,
    ]
      .filter(Boolean)
      .join(", ");

    // Monta o endereço para busca na API
    const mainSearchAddress = [
      modalEndereco,
      modalNumero,
      modalBairro,
      cep,
      "Portugal",
    ]
      .filter(Boolean)
      .join(", ");

    try {
      // Busca coordenadas do endereço do cliente
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${
          process.env.NEXT_PUBLIC_API_LOCATION_GET
        }&text=${encodeURIComponent(mainSearchAddress)}`
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao buscar as coordenadas do endereço do cliente."
        );
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        // Verifica se o endereço está em Portugal
        const country = data.features[0].properties.country;
        if (country !== "Portugal") {
          throw new Error(
            "Endereço localizado fora de Portugal, verifique o preenchimento."
          );
        }
      } else {
        console.error(
          "Endereço do cliente não encontrado para geocodificação."
        );
        alert(
          "Não foi possível localizar o endereço. Verifique os dados preenchidos."
        );
        return;
      }
    } catch (error) {
      console.error("Erro ao calcular distância:", error);
      alert("Erro ao calcular distância. Verifique seu endereço e CEP.");
      return;
    }

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
