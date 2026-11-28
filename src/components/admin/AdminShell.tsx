"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiExternalLink,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { useStoreStatusQuery } from "@/queries/config";
import { useLogout } from "@/queries/auth";

interface ItemMenu {
  rotulo: string;
  href: string;
  icone: ReactNode;
  /** Outras rotas que deixam este item marcado (ex.: detalhe do pedido). */
  tambem?: string[];
}

const SECOES: { titulo: string; itens: ItemMenu[] }[] = [
  {
    titulo: "Dia a dia",
    itens: [
      { rotulo: "Pedidos", href: "/admin/pedidos", icone: <FiShoppingBag />, tambem: ["/admin/pedido/"] },
    ],
  },
  {
    titulo: "Cardápio",
    itens: [
      {
        rotulo: "Produtos",
        href: "/admin/listarprodutos",
        icone: <FiPackage />,
        tambem: ["/admin/adicionarprodutos", "/admin/editarprodutos/"],
      },
      {
        rotulo: "Categorias",
        href: "/admin/listarcategorias",
        icone: <FiGrid />,
        tambem: ["/admin/adicionarcategorias", "/admin/editarcategorias/"],
      },
    ],
  },
  {
    titulo: "Loja",
    itens: [
      { rotulo: "Configurações", href: "/admin/config", icone: <FiSettings /> },
      { rotulo: "Frete", href: "/admin/frete", icone: <FiTruck /> },
    ],
  },
  {
    titulo: "Relatórios",
    itens: [
      { rotulo: "Estatísticas", href: "/admin/estatisticas", icone: <FiBarChart2 /> },
    ],
  },
];

const ativo = (item: ItemMenu, rota: string) =>
  rota === item.href || rota.startsWith(`${item.href}/`) || (item.tambem ?? []).some((r) => rota.startsWith(r));

/** Bolinha + texto: loja aberta ou fechada agora. */
const StatusLoja = () => {
  const { storeOpen, loading } = useStoreStatusQuery();
  return (
    <Link
      href="/admin/config"
      className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300"
      title="Abrir as configurações da loja"
    >
      <span
        aria-hidden
        className={`h-2.5 w-2.5 rounded-full ${loading ? "bg-zinc-300" : storeOpen ? "bg-green-500" : "bg-red-500"}`}
      />
      {loading ? "Verificando..." : storeOpen ? "Loja aberta" : "Loja fechada"}
    </Link>
  );
};

const Sair = () => {
  const logout = useLogout();
  const sair = async () => {
    try {
      // Espera a API apagar o cookie; senão o middleware ainda vê o token
      await logout.mutateAsync();
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
    // Navegação completa: garante que o middleware rode sem o cookie
    window.location.href = "/admin";
  };
  return (
    <button
      type="button"
      onClick={sair}
      disabled={logout.isPending}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
    >
      <FiLogOut aria-hidden className="text-lg" />
      {logout.isPending ? "Saindo..." : "Sair da conta"}
    </button>
  );
};

const Menu = ({ rota, aoNavegar }: { rota: string; aoNavegar?: () => void }) => (
  <nav className="flex h-full flex-col">
    <Link href="/admin/pedidos" onClick={aoNavegar} className="flex items-center gap-3 px-5 py-5">
      <Image src="/logo-header.svg" alt="" width={30} height={40} />
      <span>
        <span className="block font-bold leading-tight text-zinc-900">Spumoni</span>
        <span className="block text-xs text-zinc-500">Painel do restaurante</span>
      </span>
    </Link>

    <div className="flex-1 overflow-y-auto px-3 pb-4">
      {SECOES.map((secao) => (
        <div key={secao.titulo} className="mt-4 first:mt-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {secao.titulo}
          </p>
          <ul className="flex flex-col gap-0.5">
            {secao.itens.map((item) => {
              const marcado = ativo(item, rota);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={aoNavegar}
                    aria-current={marcado ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      marcado
                        ? "bg-purple-principal-500/10 text-purple-principal-700"
                        : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <span aria-hidden className={`text-lg ${marcado ? "" : "text-zinc-400"}`}>
                      {item.icone}
                    </span>
                    {item.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-0.5 border-t border-zinc-200 p-3">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
      >
        <FiExternalLink aria-hidden className="text-lg" />
        Ver o site
      </a>
      <Sair />
    </div>
  </nav>
);

/**
 * Moldura de todas as telas do /admin: menu lateral fixo no computador,
 * gaveta no celular e barra do topo com o status da loja. A tela de login
 * (/admin) fica sem moldura. Nada disso aparece na impressão.
 */
export const AdminShell = ({ children }: { children: ReactNode }) => {
  const rota = usePathname() ?? "";
  const [aberto, setAberto] = useState(false);

  // Fecha a gaveta ao trocar de página e com Esc
  useEffect(() => setAberto(false), [rota]);
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  if (rota === "/admin") return <>{children}</>;

  return (
    <div className="min-h-dvh bg-zinc-100">
      {/* Menu fixo (computador) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white lg:block print:hidden">
        <Menu rota={rota} />
      </aside>

      {/* Gaveta (celular) */}
      <div className={`fixed inset-0 z-50 lg:hidden print:hidden ${aberto ? "" : "pointer-events-none"}`}>
        <div
          aria-hidden
          onClick={() => setAberto(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${aberto ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu do painel"
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl transition-transform ${
            aberto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
            className="absolute right-3 top-4 cursor-pointer rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
          >
            <FiX aria-hidden className="text-xl" />
          </button>
          <Menu rota={rota} aoNavegar={() => setAberto(false)} />
        </aside>
      </div>

      <div className="lg:pl-64 print:pl-0">
        {/* Barra do topo */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur print:hidden">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setAberto(true)}
              aria-label="Abrir menu"
              aria-expanded={aberto}
              className="cursor-pointer rounded-lg p-2 text-zinc-700 hover:bg-zinc-100"
            >
              <FiMenu aria-hidden className="text-xl" />
            </button>
            <Image src="/logo-header.svg" alt="Spumoni" width={22} height={30} />
          </div>
          <span className="hidden lg:block" />
          <StatusLoja />
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};
