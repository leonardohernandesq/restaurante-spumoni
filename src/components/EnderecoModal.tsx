"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { Modal } from "./Modal";
import { useAllFretesQuery } from "@/queries/fretes";
import {
  descreverEndereco,
  formatarCep,
  isEnderecoCompleto,
  type CheckoutForm,
  type EnderecoEntrega,
} from "@/domain/checkout";

interface EnderecoModalProps {
  /** Endereço da loja, mostrado na retirada. */
  loja: string;
}

const inputClass =
  "w-full p-2 border border-zinc-400 rounded-md focus:border-purple-principal-500 focus:outline-none";
const labelClass = "block text-sm font-medium mb-1";
const Obrigatorio = () => <span className="text-red-500">*</span>;

/**
 * Endereço de entrega (ou da loja, na retirada). O modal edita um rascunho;
 * só ao confirmar o endereço vai para o formulário (e entra no frete).
 */
export const EnderecoModal = ({ loja }: EnderecoModalProps) => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CheckoutForm>();
  const [tipoEntrega, endereco] = useWatch({
    control,
    name: ["tipoEntrega", "endereco"],
  });

  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<EnderecoEntrega>(endereco);
  const [erroRascunho, setErroRascunho] = useState("");

  const { data: fretes = [] } = useAllFretesQuery();
  const cidades = [...new Set(fretes.map((f) => f.cidade))];
  const bairros = fretes
    .filter((f) => f.cidade === rascunho.cidade)
    .map((f) => f.bairro);

  const isDelivery = tipoEntrega === "delivery";
  const enderecoExibido = isDelivery
    ? descreverEndereco(endereco) || "Nenhum endereço cadastrado"
    : loja;

  const abrir = () => {
    setRascunho(endereco);
    setErroRascunho("");
    setAberto(true);
  };

  const alterar = (campo: keyof EnderecoEntrega, valor: string) => {
    setErroRascunho("");
    setRascunho((atual) => ({
      ...atual,
      [campo]: valor,
      // O bairro escolhido pertence à cidade anterior; mantê-lo calculava
      // a taxa de entrega errada.
      ...(campo === "cidade" && valor !== atual.cidade ? { bairro: "" } : {}),
    }));
  };

  const confirmar = () => {
    if (!isEnderecoCompleto(rascunho)) {
      setErroRascunho(
        "Por favor, complete todos os campos obrigatórios: Endereço, Número, CEP, Cidade e Bairro.",
      );
      return;
    }
    setValue("endereco", rascunho, { shouldDirty: true });
    clearErrors("endereco");
    setAberto(false);
  };

  return (
    <section className="flex items-center justify-between border-b border-zinc-200 pb-4">
      <div className="flex-1">
        <p className="font-light text-sm text-zinc-600">
          {isDelivery ? "ENTREGAR EM" : "RETIRAR EM"}
        </p>
        <p className="font-medium pr-2 mt-1">{enderecoExibido}</p>
        {errors.endereco && isDelivery && (
          <p className="text-red-700 text-sm mt-1">
            ⚠️ Você deve inserir um endereço válido
          </p>
        )}
      </div>

      {isDelivery && (
        <div className="flex-shrink-0">
          <button
            type="button"
            className={`bg-purple-principal-700 text-white p-2 rounded-full hover:bg-purple-principal-900 transition-colors ${
              errors.endereco ? "animate-bounce" : ""
            } cursor-pointer`}
            onClick={abrir}
            aria-label="Editar endereço"
          >
            <BiPencil size={20} />
          </button>

          {aberto && (
            <Modal onClose={() => setAberto(false)}>
              <h2 className="text-center text-2xl font-bold mb-4">
                Insira seu endereço
              </h2>

              <div className="flex flex-col gap-3">
                <div>
                  <label htmlFor="endereco" className={labelClass}>
                    Endereço <Obrigatorio />
                  </label>
                  <input
                    id="endereco"
                    value={rascunho.rua}
                    onChange={(e) => alterar("rua", e.target.value)}
                    placeholder="Rua, Avenida, etc."
                    autoComplete="address-line1"
                    className={inputClass}
                  />
                </div>

                <div className="flex gap-3">
                  <div className="w-1/3">
                    <label htmlFor="numero" className={labelClass}>
                      Número <Obrigatorio />
                    </label>
                    <input
                      id="numero"
                      value={rascunho.numero}
                      onChange={(e) => alterar("numero", e.target.value)}
                      placeholder="Nº"
                      className={inputClass}
                    />
                  </div>
                  <div className="w-1/3">
                    <label htmlFor="complemento" className={labelClass}>
                      Complemento
                    </label>
                    <input
                      id="complemento"
                      value={rascunho.complemento}
                      onChange={(e) => alterar("complemento", e.target.value)}
                      placeholder="Apto, Bloco, etc."
                      className={inputClass}
                    />
                  </div>
                  <div className="w-1/3">
                    <label htmlFor="cep" className={labelClass}>
                      CEP <Obrigatorio />
                    </label>
                    <input
                      type="text"
                      id="cep"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={rascunho.cep}
                      onChange={(e) =>
                        alterar("cep", formatarCep(e.target.value))
                      }
                      placeholder="XXXXX-XXX"
                      maxLength={9}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label htmlFor="cidade" className={labelClass}>
                      Cidade <Obrigatorio />
                    </label>
                    <select
                      id="cidade"
                      value={rascunho.cidade}
                      onChange={(e) => alterar("cidade", e.target.value)}
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Selecione a cidade
                      </option>
                      {cidades.map((cidade) => (
                        <option key={cidade} value={cidade}>
                          {cidade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label htmlFor="bairro" className={labelClass}>
                      Bairro <Obrigatorio />
                    </label>
                    <select
                      id="bairro"
                      value={rascunho.bairro}
                      onChange={(e) => alterar("bairro", e.target.value)}
                      className={`${inputClass} disabled:opacity-30 disabled:cursor-not-allowed`}
                      disabled={bairros.length === 0}
                    >
                      <option value="" disabled>
                        Selecione o bairro
                      </option>
                      {bairros.map((bairro) => (
                        <option key={bairro} value={bairro}>
                          {bairro}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="referencia" className={labelClass}>
                    Ponto de Referência
                  </label>
                  <textarea
                    id="referencia"
                    value={rascunho.referencia}
                    onChange={(e) => alterar("referencia", e.target.value)}
                    placeholder="Ex: Próximo ao mercado, em frente à igreja, etc."
                    className={`${inputClass} h-24 resize-none`}
                  />
                </div>

                {erroRascunho && (
                  <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    ⚠️ {erroRascunho}
                  </p>
                )}

                <button
                  type="button"
                  onClick={confirmar}
                  className="bg-purple-principal-500 p-3 rounded-md text-white font-medium cursor-pointer hover:bg-purple-principal-900 transition-colors w-full"
                >
                  Adicionar Endereço
                </button>
              </div>
            </Modal>
          )}
        </div>
      )}
    </section>
  );
};
