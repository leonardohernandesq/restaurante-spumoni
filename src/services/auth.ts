import { api } from "@/config/api";
import type {
  Credenciais,
  LoginResponse,
  MensagemResponse,
  ResetPasswordDto,
} from "@/types/auth";

/** Login do admin. O token fica num cookie httpOnly gravado pela API. */
export const authService = {
  async login({ email, senha }: Credenciais): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/users/login", { email, senha });
    return data;
  },

  async logout(): Promise<MensagemResponse> {
    const { data } = await api.post<MensagemResponse>("/users/logout");
    return data;
  },

  async pedirRecuperacao(email: string): Promise<MensagemResponse> {
    const { data } = await api.post<MensagemResponse>("/users/recovery", { email });
    return data;
  },

  async redefinirSenha({ code, new_password }: ResetPasswordDto): Promise<MensagemResponse> {
    const { data } = await api.post<MensagemResponse>("/users/reset", {
      code,
      new_password,
    });
    return data;
  },
};
