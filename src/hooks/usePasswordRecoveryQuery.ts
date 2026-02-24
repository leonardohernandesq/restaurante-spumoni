import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset, resetPassword } from "@/services/auth";

export const useRequestPasswordReset = () => {
  return useMutation<any, Error, string>({ mutationFn: requestPasswordReset });
};

export const useResetPassword = () => {
  return useMutation<any, Error, { token: string; newPassword: string }>({
    mutationFn: resetPassword,
  });
};
