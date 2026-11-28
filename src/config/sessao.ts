/**
 * Decide se uma resposta 401 da API deve mandar o usuário de volta ao login.
 *
 * Só vale dentro do admin (/admin/...). Ignora as próprias chamadas de
 * login/logout, para não entrar em loop.
 */
export const deveVoltarParaLogin = (
  status: number | undefined,
  urlRequisicao: string | undefined,
  pathname: string,
): boolean => {
  if (status !== 401) return false;
  if (!pathname.startsWith("/admin/")) return false;

  const url = urlRequisicao ?? "";
  return !url.includes("/users/login") && !url.includes("/users/logout");
};
