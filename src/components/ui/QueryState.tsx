import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { LoadingIcon } from "@/components/LoadingIcon";

interface ErrorStateProps {
  mensagem?: string;
  /** Mostra o botão "Tentar de novo". */
  onRetry?: () => void;
  /** Desabilita o botão enquanto a nova tentativa carrega. */
  tentando?: boolean;
}

/** Falha ao carregar dados (primeira carga sem nada para mostrar). */
export const ErrorState = ({
  mensagem = "Não foi possível carregar os dados.",
  onRetry,
  tentando = false,
}: ErrorStateProps) => (
  <div
    role="alert"
    className="flex flex-col items-center gap-3 py-10 px-4 text-center text-zinc-700"
  >
    <FiAlertTriangle size={32} className="text-red-600" />
    <p>{mensagem}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        disabled={tentando}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-principal-700 text-white cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-wait"
      >
        <FiRefreshCw className={tentando ? "animate-spin" : ""} />
        Tentar de novo
      </button>
    )}
  </div>
);

/** Primeira carga, sem dados ainda. */
export const LoadingState = ({ mensagem = "Carregando..." }: { mensagem?: string }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-zinc-600">
    <LoadingIcon color="text-purple-principal-700" />
    <span>{mensagem}</span>
  </div>
);

/**
 * Aviso discreto quando a atualização em segundo plano falhou, mas ainda há
 * dados antigos na tela (ex.: polling dos pedidos sem internet).
 */
export const StaleWarning = ({ mensagem }: { mensagem: string }) => (
  <p
    role="status"
    className="flex items-center gap-2 my-3 px-3 py-2 rounded-md bg-amber-100 text-amber-900 text-sm"
  >
    <FiAlertTriangle className="shrink-0" />
    {mensagem}
  </p>
);
