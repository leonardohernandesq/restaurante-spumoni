"use client";

import { useEffect } from "react";
import { BiPencil } from "react-icons/bi";
import { Modal } from "./Modal";

interface EnderecoModalProps {
  endereco: string;
  delivery: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  abrirModalEndereco: () => void;
  handleEndereco: () => void;
  errorEndereco: string;
  addressError: boolean;
  modalEndereco: string;
  setModalEndereco: (value: string) => void;
  modalNumero: string;
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
  loja: string;
  limparEndereco?: () => void;
}

export const EnderecoModal = ({
  endereco,
  delivery,
  showModal,
  setShowModal,
  abrirModalEndereco,
  handleEndereco,
  errorEndereco,
  addressError,
  modalEndereco,
  modalNumero,
  modalComplemento,
  modalBairro,
  cep,
  modalReferencia,
  handleInputChange,
  handleCepChange,
  loja,
  limparEndereco,
}: EnderecoModalProps) => {
  // Limpa o endereço quando mudar de delivery para takeaway
  useEffect(() => {
    if (delivery === "takeaway" && endereco && limparEndereco) {
      limparEndereco();
    }
  }, [delivery, endereco, limparEndereco]);

  const isDelivery = delivery === "delivery";
  const enderecoExibido = isDelivery ? endereco : loja;
  const tituloSecao = isDelivery ? "ENTREGAR EM" : "RETIRAR EM";

  return (
    <section className="flex items-center justify-between border-b border-zinc-200 pb-4">
      {/* Informações de Endereço */}
      <div className="flex-1">
        <p className="font-light text-sm text-zinc-600">{tituloSecao}</p>
        <p className="font-medium pr-2 mt-1">
          {enderecoExibido ||
            (isDelivery ? "Nenhum endereço cadastrado" : loja)}
        </p>
        {addressError && isDelivery && (
          <p className="text-red-700 text-sm mt-1">
            ⚠️ Você deve inserir um endereço válido
          </p>
        )}
      </div>

      {/* Botão de Editar e Modal (apenas para delivery) */}
      {isDelivery && (
        <div className="flex-shrink-0">
          <button
            className={`bg-purple-principal-700 text-white p-2 rounded-full hover:bg-purple-principal-900 transition-colors ${
              addressError && "animate-bounce"
            } cursor-pointer`}
            onClick={abrirModalEndereco}
            aria-label="Editar endereço"
          >
            <BiPencil size={20} />
          </button>

          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <h2 className="text-center text-2xl font-bold mb-4">
                Insira seu endereço
              </h2>

              {/* Formulário de Endereço */}
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEndereco();
                }}
              >
                {/* Endereço */}
                <div>
                  <label
                    htmlFor="endereco"
                    className="block text-sm font-medium mb-1"
                  >
                    Endereço <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endereco"
                    value={modalEndereco}
                    onChange={(e) =>
                      handleInputChange("modalEndereco", e.target.value)
                    }
                    placeholder="Rua, Avenida, etc."
                    className="w-full p-2 border border-zinc-400 rounded-md focus:border-purple-principal-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Número e Complemento */}
                <div className="flex gap-3">
                  <div className="w-1/3">
                    <label
                      htmlFor="numero"
                      className="block text-sm font-medium mb-1"
                    >
                      Número <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="numero"
                      value={modalNumero}
                      onChange={(e) =>
                        handleInputChange("modalNumero", e.target.value)
                      }
                      placeholder="Nº"
                      className="w-full p-2 border border-zinc-400 rounded-md focus:border-purple-principal-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="w-1/3">
                    <label
                      htmlFor="complemento"
                      className="block text-sm font-medium mb-1"
                    >
                      Complemento
                    </label>
                    <input
                      id="complemento"
                      value={modalComplemento}
                      onChange={(e) =>
                        handleInputChange("modalComplemento", e.target.value)
                      }
                      placeholder="Apto, Bloco, etc."
                      className="w-full p-2 border border-zinc-400 rounded-md focus:border-purple-principal-500 focus:outline-none"
                    />
                  </div>
                  {/* CEP */}
                  <div className="w-1/3">
                    <label
                      htmlFor="cep"
                      className="block text-sm font-medium mb-1"
                    >
                      CEP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cep"
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="XXXXX-XXX"
                      pattern="\d{5}-\d{3}"
                      maxLength={9}
                      className="w-full p-2 border border-zinc-400 rounded-md focus:border-purple-principal-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Bairro */}
                <div>
                  <label
                    htmlFor="bairro"
                    className="block text-sm font-medium mb-1"
                  >
                    Bairro <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="bairro"
                    value={modalBairro}
                    onChange={(e) =>
                      handleInputChange("modalBairro", e.target.value)
                    }
                    className="w-full p-2 border border-zinc-400 rounded-md focus:border-purple-principal-500 focus:outline-none"
                    required
                  >
                    <option value="" disabled>
                      Selecione o bairro
                    </option>
                    <option value="Unhos">Unhos</option>
                    <option value="Sao Joao da Talha">São João da Talha</option>
                    <option value="Sacavem">Sacavém</option>
                    <option value="Portela">Portela</option>
                    <option value="Olivais">Olivais</option>
                  </select>
                </div>

                {/* Referência */}
                <div>
                  <label
                    htmlFor="referencia"
                    className="block text-sm font-medium mb-1"
                  >
                    Ponto de Referência
                  </label>
                  <textarea
                    id="referencia"
                    value={modalReferencia}
                    onChange={(e) =>
                      handleInputChange("modalReferencia", e.target.value)
                    }
                    placeholder="Ex: Próximo ao mercado, em frente à igreja, etc."
                    className="w-full h-24 p-2 border border-zinc-400 rounded-md focus:border-purple-principal-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Mensagem de Erro */}
                {errorEndereco && (
                  <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    ⚠️ {errorEndereco}
                  </p>
                )}

                {/* Botão de Confirmar */}
                <button
                  type="submit"
                  disabled={!!errorEndereco}
                  className="bg-purple-principal-500 p-3 rounded-md text-white font-medium cursor-pointer hover:bg-purple-principal-900 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed w-full"
                >
                  Adicionar Endereço
                </button>
              </form>
            </Modal>
          )}
        </div>
      )}
    </section>
  );
};
