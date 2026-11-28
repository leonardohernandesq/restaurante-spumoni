import type { ReactNode } from "react";

/** Título da página do admin (o menu fica na moldura, em AdminShell). */
export const TituloAdmin = ({ title, children }: { title: string; children?: ReactNode }) => (
  <header className="flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
    {children}
  </header>
);
