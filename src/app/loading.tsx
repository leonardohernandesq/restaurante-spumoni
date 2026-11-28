/**
 * Mostrado enquanto a próxima página carrega do servidor (vale para todas as
 * rotas que não têm um loading.tsx próprio). A barra do topo já indica a
 * navegação; isto evita a tela parada quando a página demora.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-white"
      role="status"
      aria-live="polite"
    >
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-purple-principal-500/20 border-t-purple-principal-500" />
      <p className="text-sm font-medium text-zinc-500">Carregando...</p>
    </div>
  );
}
