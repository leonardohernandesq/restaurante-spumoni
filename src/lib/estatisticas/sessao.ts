/**
 * Sessão das estatísticas (SÓ SERVIDOR — usa variáveis sem NEXT_PUBLIC_).
 *
 * - STATS_PASSWORD: senha pedida em /admin/estatisticas, mesmo já logado.
 * - STATS_API_KEY: chave interna enviada à API PHP (X-Stats-Key); é a mesma
 *   de `secrets/stats_key.php` no servidor.
 *
 * O cookie guarda só a validade + uma assinatura HMAC. Trocar a senha ou a
 * chave invalida todas as sessões abertas.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_SESSAO = "stats_sessao";
/** Depois disso, pede a senha de novo. */
export const DURACAO_SESSAO_S = 4 * 60 * 60;

export interface ConfigEstatisticas {
  senha: string;
  chaveApi: string;
}

/** `null` = não configurado (a rota responde 503 e nada fica aberto). */
export const lerConfig = (
  env: Record<string, string | undefined> = process.env,
): ConfigEstatisticas | null => {
  const senha = env.STATS_PASSWORD ?? "";
  const chaveApi = env.STATS_API_KEY ?? "";
  if (senha.length < 6 || chaveApi.length < 32) return null;
  return { senha, chaveApi };
};

const sha256 = (valor: string) => createHash("sha256").update(valor, "utf8").digest();

const chaveDeAssinatura = (c: ConfigEstatisticas) => sha256(`${c.senha}\0${c.chaveApi}`);

const assinar = (c: ConfigEstatisticas, exp: number) =>
  createHmac("sha256", chaveDeAssinatura(c)).update(`stats:${exp}`).digest("base64url");

/** Comparação em tempo constante (não revela quantos caracteres acertou). */
export const senhaConfere = (c: ConfigEstatisticas, tentativa: unknown): boolean =>
  typeof tentativa === "string" && timingSafeEqual(sha256(tentativa), sha256(c.senha));

export const criarToken = (c: ConfigEstatisticas, agoraMs = Date.now()): string => {
  const exp = Math.floor(agoraMs / 1000) + DURACAO_SESSAO_S;
  return `${exp}.${assinar(c, exp)}`;
};

export const tokenValido = (
  c: ConfigEstatisticas,
  token: string | undefined,
  agoraMs = Date.now(),
): boolean => {
  if (!token) return false;
  const [expTexto, assinatura, ...resto] = token.split(".");
  const exp = Number(expTexto);
  if (resto.length || !Number.isInteger(exp) || !assinatura) return false;
  if (exp * 1000 <= agoraMs) return false;

  const esperada = Buffer.from(assinar(c, exp));
  const recebida = Buffer.from(assinatura);
  return esperada.length === recebida.length && timingSafeEqual(esperada, recebida);
};

/* ---------- Limite de tentativas da senha ---------- */

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 10 * 60 * 1000;
const tentativas = new Map<string, { erros: number; ate: number }>();

/**
 * Bloqueia o IP por 10 min depois de 5 senhas erradas. Fica em memória: em
 * produção cada instância conta separado, mas já impede tentativa em massa.
 */
export const limiteDeTentativas = {
  bloqueado(ip: string, agora = Date.now()): number {
    const t = tentativas.get(ip);
    if (!t || t.ate <= agora) return 0;
    return t.erros >= MAX_TENTATIVAS ? Math.ceil((t.ate - agora) / 1000) : 0;
  },
  registrarErro(ip: string, agora = Date.now()) {
    const t = tentativas.get(ip);
    const ativo = t && t.ate > agora ? t : { erros: 0, ate: agora + BLOQUEIO_MS };
    ativo.erros++;
    ativo.ate = agora + BLOQUEIO_MS;
    tentativas.set(ip, ativo);
    if (tentativas.size > 5000) tentativas.clear(); // não deixa crescer sem fim
  },
  limpar(ip: string) {
    tentativas.delete(ip);
  },
};
