"use client";

import { useState, type FormEvent } from "react";
import { FiLock } from "react-icons/fi";
import { useSessaoEstatisticas } from "@/queries/estatisticas";

/** Senha extra das estatísticas (mesmo já logado no admin). */
export const SenhaEstatisticas = ({ onLiberado }: { onLiberado: () => void }) => {
  const [senha, setSenha] = useState("");
  const { entrar } = useSessaoEstatisticas();

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!senha || entrar.isPending) return;
    entrar.mutate(senha, {
      onSuccess: () => {
        setSenha("");
        onLiberado();
      },
    });
  };

  return (
    <form
      onSubmit={enviar}
      className="mx-auto my-10 max-w-sm bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="p-2.5 rounded-full bg-purple-principal-700 text-white">
          <FiLock aria-hidden />
        </span>
        <div>
          <h2 className="font-semibold text-zinc-900">Área restrita</h2>
          <p className="text-sm text-zinc-600">Digite a senha das estatísticas.</p>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Senha
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
          autoFocus
          className="p-2 border border-zinc-300 rounded-md bg-zinc-50"
        />
      </label>

      {entrar.isError && (
        <p role="alert" className="text-sm text-red-700">
          {entrar.error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={!senha || entrar.isPending}
        className="bg-purple-principal-700 text-white py-2 rounded-md font-medium cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {entrar.isPending ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
};
