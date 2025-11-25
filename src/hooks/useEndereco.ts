import { useState, useEffect } from "react";
import { useCep } from "@/hooks/useCep";

const RESTAURANTE_ADDRESS =
  "Estrada da Giesteira 65/67, Arruda dos Vinhos, 2630-241, Portugal";
const EARTH_RADIUS_KM = 6371;

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

  // Estados de distância
  const [distanciaCliente, setDistanciaCliente] = useState<number | null>(null);
  const [restauranteCoord, setRestauranteCoord] = useState<
    [number, number] | null
  >(null);

  // Carrega endereço salvo e coordenadas do restaurante ao iniciar
  useEffect(() => {
    loadSavedAddress();
    buscarCoordenadasRestaurante();
  }, []);

  // Carrega informações detalhadas do endereço
  useEffect(() => {
    const enderecoInfo = localStorage.getItem("enderecoInfo");
    if (!enderecoInfo) return;

    try {
      const parsed = JSON.parse(enderecoInfo);
      setModalEndereco(parsed.modalEndereco || "");
      setModalNumero(parsed.modalNumero || "");
      setModalComplemento(parsed.modalComplemento || "");
      setModalBairro(parsed.modalBairro || "");
      setModalReferencia(parsed.modalReferencia || "");
      setCepValue(parsed.cep || "");
    } catch (err) {
      console.error("Erro ao carregar dados do endereço:", err);
    }
  }, [setCepValue]);

  // Limpa erro quando todos os campos obrigatórios são preenchidos
  useEffect(() => {
    if (modalEndereco && modalNumero && modalBairro && cep) {
      setErrorEndereco("");
    }
  }, [modalEndereco, modalNumero, modalBairro, cep]);

  // ========== FUNÇÕES DE CARREGAMENTO ==========

  const loadSavedAddress = () => {
    const loadEndereco = localStorage.getItem("endereco");
    const loadDistancia = localStorage.getItem("distanciaCliente");

    if (loadEndereco) setEndereco(loadEndereco);
    if (loadDistancia) setDistanciaCliente(Number(loadDistancia));
  };

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
    preencherCamposModal();
    setShowModal(true);
  };

  const preencherCamposModal = () => {
    const enderecoSalvo = localStorage.getItem("enderecoInfo");
    if (!enderecoSalvo) return;

    try {
      const enderecoObj = JSON.parse(enderecoSalvo);
      setModalEndereco(enderecoObj.modalEndereco || "");
      setModalNumero(enderecoObj.modalNumero || "");
      setModalComplemento(enderecoObj.modalComplemento || "");
      setModalBairro(enderecoObj.modalBairro || "");
      setModalReferencia(enderecoObj.modalReferencia || "");
      setCepValue(enderecoObj.cep || "");
    } catch (error) {
      console.error("Erro ao preencher campos do modal:", error);
    }
  };

  const limparEndereco = () => {
    setEndereco("");
    setModalEndereco("");
    setModalNumero("");
    setModalComplemento("");
    setModalBairro("");
    setModalReferencia("");
    setCepValue("");
    setDistanciaCliente(null);
    setAddressError(false);
    setErrorEndereco("");

    localStorage.removeItem("endereco");
    localStorage.removeItem("enderecoInfo");
    localStorage.removeItem("distanciaCliente");
  };

  // ========== FUNÇÕES DE GEOLOCALIZAÇÃO ==========

  async function buscarCoordenadasRestaurante() {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${
          process.env.NEXT_PUBLIC_API_LOCATION_GET
        }&text=${encodeURIComponent(RESTAURANTE_ADDRESS)}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar coordenadas do restaurante.");
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const location = data.features[0].geometry.coordinates;
        const longitude = location[0];
        const latitude = location[1];
        setRestauranteCoord([latitude, longitude]);
      } else {
        throw new Error(
          "Nenhum resultado encontrado para o endereço do restaurante."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas do restaurante:", error);
    }
  }

  async function calcularDistanciaEntreCoordenadas(
    restaurante: [number, number],
    cliente: [number, number]
  ): Promise<number> {
    const dLat = ((cliente[0] - restaurante[0]) * Math.PI) / 180;
    const dLon = ((cliente[1] - restaurante[1]) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((restaurante[0] * Math.PI) / 180) *
        Math.cos((cliente[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

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
        const location = data.features[0].geometry.coordinates;
        const clienteCoord: [number, number] = [location[1], location[0]];

        // Verifica se o endereço está em Portugal
        const country = data.features[0].properties.country;
        if (country !== "Portugal") {
          throw new Error(
            "Endereço localizado fora de Portugal, verifique o preenchimento."
          );
        }

        // Verifica se as coordenadas do restaurante estão carregadas
        if (!restauranteCoord) {
          console.error("Coordenadas do restaurante ainda não carregadas.");
          alert(
            "Não foi possível calcular a distância no momento. Tente novamente."
          );
          return;
        }

        // Calcula a distância
        const distancia = await calcularDistanciaEntreCoordenadas(
          restauranteCoord,
          clienteCoord
        );
        setDistanciaCliente(distancia);
        localStorage.setItem("distanciaCliente", distancia.toString());

        console.log(`Distância calculada: ${distancia.toFixed(2)} km`);
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

    // Salva o endereço no localStorage
    const enderecoInfo = {
      modalEndereco,
      modalNumero,
      modalComplemento,
      modalBairro,
      modalReferencia,
      cep,
    };

    const enderecoCompleto = modalReferencia
      ? `${enderecoExibicao} | ${modalReferencia}`
      : enderecoExibicao;

    localStorage.setItem("endereco", enderecoCompleto);
    localStorage.setItem("enderecoInfo", JSON.stringify(enderecoInfo));

    setEndereco(enderecoCompleto);
    setShowModal(false);
    setAddressError(false);
  };

  // ========== FUNÇÃO DE PREENCHIMENTO AUTOMÁTICO ==========

  const preencherEnderecoAutomaticamente = async () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.openrouteservice.org/geocode/reverse?api_key=${process.env.NEXT_PUBLIC_API_LOCATION_GET}&point.lon=${longitude}&point.lat=${latitude}`
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar o endereço na API.");
          }

          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const enderecoData = data.features[0].properties;

            setModalEndereco(enderecoData.street || enderecoData.name || "");
            setModalNumero(enderecoData.housenumber || "");
            setModalComplemento("");
            setModalBairro(
              enderecoData.suburb ||
                enderecoData.neighbourhood ||
                enderecoData.locality ||
                enderecoData.district ||
                ""
            );

            const cepEncontrado =
              enderecoData.postcode ||
              enderecoData.postalcode ||
              enderecoData.zipcode ||
              "";
            setCepValue(cepEncontrado);
            setModalReferencia("");
          } else {
            alert("Não foi possível encontrar seu endereço automaticamente.");
          }
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
          alert("Erro ao buscar seu endereço. Tente novamente.");
        }
      },
      (error) => {
        console.error("Erro de geolocalização:", error);
        alert(`Erro ao pegar sua localização: ${error.message}`);
      }
    );
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
    distanciaCliente,

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
    preencherEnderecoAutomaticamente,
    limparEndereco,
  };
};
