"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiInfo } from "react-icons/fi";

interface AjudaProps {
  /** Explicação mostrada no balão. */
  children: ReactNode;
  /** Nome lido por leitores de tela (ex.: "Como é calculado: Faturamento"). */
  rotulo?: string;
}

const LARGURA = 288; // px (w-72)
const MARGEM = 8;

/**
 * Ícone "i" com um balão de explicação. Abre ao passar o mouse, ao focar com
 * o teclado ou ao tocar (celular); fecha ao sair, com Esc ou tocando fora.
 * O balão vai direto no <body> (portal): fica por cima de tudo, pode ter
 * parágrafos mesmo com o ícone dentro de um título, e não sai da tela.
 */
export const Ajuda = ({ children, rotulo = "Como é calculado" }: AjudaProps) => {
  const id = useId();
  const botao = useRef<HTMLButtonElement>(null);
  const [aberto, setAberto] = useState(false);
  const [fixo, setFixo] = useState(false); // aberto por clique/toque
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const posicionar = () => {
    const r = botao.current?.getBoundingClientRect();
    if (!r) return;
    const largura = Math.min(LARGURA, window.innerWidth - MARGEM * 2);
    const left = Math.min(
      Math.max(r.left + r.width / 2 - largura / 2, MARGEM),
      window.innerWidth - largura - MARGEM,
    );
    setPos({ top: r.bottom + 6, left });
  };

  const abrir = () => {
    posicionar();
    setAberto(true);
  };
  const fechar = () => {
    setAberto(false);
    setFixo(false);
  };

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    const aoClicarFora = (e: PointerEvent) => {
      if (!botao.current?.contains(e.target as Node)) fechar();
    };
    window.addEventListener("keydown", aoTeclar);
    window.addEventListener("pointerdown", aoClicarFora);
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      window.removeEventListener("pointerdown", aoClicarFora);
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberto]);

  return (
    <span className="inline-flex align-middle">
      <button
        ref={botao}
        type="button"
        aria-label={rotulo}
        aria-describedby={aberto ? id : undefined}
        aria-expanded={aberto}
        className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full text-zinc-400 transition hover:text-zinc-700 focus-visible:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-zinc-500"
        onMouseEnter={abrir}
        onMouseLeave={() => !fixo && setAberto(false)}
        onFocus={abrir}
        onBlur={fechar}
        onClick={() => {
          if (fixo) return fechar();
          abrir();
          setFixo(true);
        }}
      >
        <FiInfo aria-hidden size={15} />
      </button>

      {aberto &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            style={{
              top: pos.top,
              left: pos.left,
              width: Math.min(LARGURA, window.innerWidth - MARGEM * 2),
            }}
            className="fixed z-50 rounded-lg bg-zinc-900 px-3 py-2.5 text-left text-xs font-normal leading-relaxed text-white shadow-lg [&_strong]:font-semibold [&_strong]:text-white [&_p+p]:mt-1.5"
          >
            {children}
          </div>,
          document.body,
        )}
    </span>
  );
};
