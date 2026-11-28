export interface Credenciais {
  email: string;
  senha: string;
}

export interface UsuarioLogado {
  id: number | string;
  name?: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: UsuarioLogado;
}

export interface ResetPasswordDto {
  code: string;
  new_password: string;
}

/** Respostas simples da API ({ message }). */
export interface MensagemResponse {
  message?: string;
}
