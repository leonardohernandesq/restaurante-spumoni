import axios from "axios";
import { deveVoltarParaLogin } from "./sessao";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let redirecionandoParaLogin = false;

// Sessão do admin expirou (a API responde 401): apaga o cookie pelo logout
// e volta para a tela de login, em vez de deixar o admin em branco.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      typeof window !== "undefined" &&
      !redirecionandoParaLogin &&
      deveVoltarParaLogin(
        error?.response?.status,
        error?.config?.url,
        window.location.pathname,
      )
    ) {
      redirecionandoParaLogin = true;
      try {
        await api.post("/users/logout");
      } catch {
        // mesmo sem logout, a tela de login resolve
      }
      window.location.href = "/admin";
    }

    return Promise.reject(error);
  },
);
