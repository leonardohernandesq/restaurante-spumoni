import type { ReactNode } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Texto ao lado dos botões (ex.: "42 pedidos"). */
  resumo?: ReactNode;
  /** Seletor de itens por página (opcional). */
  perPage?: number;
  perPageOptions?: readonly number[];
  onPerPageChange?: (perPage: number) => void;
}

const botao =
  "px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm font-medium";

/** Paginação simples: anterior / próxima, com seletor de itens por página. */
export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  resumo,
  perPage,
  perPageOptions,
  onPerPageChange,
}: PaginationProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    {perPageOptions && onPerPageChange ? (
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <span>Itens por página:</span>
        {perPageOptions.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPerPageChange(n)}
            className={`px-2 py-1 rounded cursor-pointer text-sm ${
              perPage === n
                ? "bg-green-principal-700 text-white font-semibold"
                : "bg-zinc-100 hover:bg-zinc-200"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    ) : (
      <span />
    )}

    <div className="flex items-center gap-3 text-sm">
      <span className="text-zinc-500">
        {resumo && <>{resumo} · </>}
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={botao}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={botao}
        aria-label="Próxima página"
      >
        Próxima →
      </button>
    </div>
  </div>
);
