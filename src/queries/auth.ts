import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import type { Credenciais, ResetPasswordDto } from "@/types/auth";

/** Login do admin. O token vem num cookie httpOnly gravado pela API. */
export const useLogin = () =>
  useMutation({
    mutationFn: (credenciais: Credenciais) => authService.login(credenciais),
  });

/**
 * Logout: a API apaga o cookie. Também limpa o cache, para que dados do admin
 * (pedidos, clientes) não fiquem na memória do navegador.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => queryClient.clear(),
  });
};

export const useRequestPasswordReset = () =>
  useMutation({
    mutationFn: (email: string) => authService.pedirRecuperacao(email),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (dados: ResetPasswordDto) => authService.redefinirSenha(dados),
  });
