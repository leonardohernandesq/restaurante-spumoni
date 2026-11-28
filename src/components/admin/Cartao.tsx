import type { ReactNode } from "react";

interface CartaoProps {
  icone: ReactNode;
  titulo: string;
  descricao?: string;
  /** Conteúdo à direita do título (ex.: um botão). */
  acao?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Cartão branco com ícone e título, usado nas telas do admin. */
export const Cartao = ({ icone, titulo, descricao, acao, className = "", children }: CartaoProps) => (
  <section className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}>
    <header className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-principal-500/10 text-lg text-purple-principal-700">
        {icone}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-zinc-900">{titulo}</h2>
        {descricao && <p className="text-sm text-zinc-500">{descricao}</p>}
      </div>
      {acao}
    </header>
    {children}
  </section>
);
