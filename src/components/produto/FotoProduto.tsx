"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import { validarImagem } from "@/domain/produtoForm";

interface FotoProdutoProps {
  /** Foto atual (edição). */
  urlInicial?: string | null;
  onEscolher: (arquivo: File) => void;
}

/** Foto do produto: clicar ou arrastar o arquivo; mostra a prévia. */
export const FotoProduto = ({ urlInicial, onEscolher }: FotoProdutoProps) => {
  const input = useRef<HTMLInputElement>(null);
  const [previa, setPrevia] = useState<string | null>(urlInicial ?? null);
  const [arrastando, setArrastando] = useState(false);

  useEffect(() => {
    if (urlInicial) setPrevia(urlInicial);
  }, [urlInicial]);

  // Libera a prévia local (blob:) quando trocar de foto ou sair da tela
  useEffect(
    () => () => {
      if (previa?.startsWith("blob:")) URL.revokeObjectURL(previa);
    },
    [previa],
  );

  const escolher = (arquivo?: File) => {
    if (!arquivo) return;
    const erro = validarImagem(arquivo);
    if (erro) {
      toast.error(erro);
      return;
    }
    setPrevia(URL.createObjectURL(arquivo));
    onEscolher(arquivo);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastando(false);
        escolher(e.dataTransfer.files?.[0]);
      }}
      className={`relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
        arrastando
          ? "border-purple-principal-500 bg-purple-principal-500/5"
          : "border-zinc-300 bg-zinc-50"
      }`}
    >
      {previa ? (
        <>
          <Image src={previa} alt="Foto do produto" fill sizes="22rem" className="object-cover" unoptimized={previa.startsWith("blob:")} />
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-zinc-800 shadow transition hover:bg-white"
          >
            <FiImage aria-hidden /> Trocar foto
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center text-zinc-600"
        >
          <FiUploadCloud aria-hidden className="text-3xl text-purple-principal-700" />
          <span className="font-medium text-zinc-800">Clique ou arraste a foto aqui</span>
          <span className="text-xs">JPG, PNG, WEBP ou GIF, até 5 MB. Foto quadrada fica melhor.</span>
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          escolher(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
};
