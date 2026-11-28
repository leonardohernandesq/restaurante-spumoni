import { describe, expect, it } from "vitest";
import {
  DURACAO_SESSAO_S,
  criarToken,
  lerConfig,
  limiteDeTentativas,
  senhaConfere,
  tokenValido,
} from "./sessao";

const config = { senha: "senha-forte", chaveApi: "k".repeat(64) };

describe("lerConfig", () => {
  it("exige senha e chave (senão fica fechado)", () => {
    expect(lerConfig({})).toBeNull();
    expect(lerConfig({ STATS_PASSWORD: "123", STATS_API_KEY: "k".repeat(64) })).toBeNull();
    expect(lerConfig({ STATS_PASSWORD: "senha-forte", STATS_API_KEY: "curta" })).toBeNull();
    expect(
      lerConfig({ STATS_PASSWORD: "senha-forte", STATS_API_KEY: "k".repeat(64) }),
    ).toEqual(config);
  });
});

describe("senha e token", () => {
  it("confere a senha", () => {
    expect(senhaConfere(config, "senha-forte")).toBe(true);
    expect(senhaConfere(config, "senha-errada")).toBe(false);
    expect(senhaConfere(config, undefined)).toBe(false);
  });

  it("token vale até expirar", () => {
    const agora = 1_800_000_000_000;
    const token = criarToken(config, agora);
    expect(tokenValido(config, token, agora)).toBe(true);
    expect(tokenValido(config, token, agora + DURACAO_SESSAO_S * 1000 + 1)).toBe(false);
  });

  it("recusa token adulterado ou de outra senha", () => {
    const agora = 1_800_000_000_000;
    const token = criarToken(config, agora);
    const [exp, assinatura] = token.split(".");
    expect(tokenValido(config, `${Number(exp) + 9999}.${assinatura}`, agora)).toBe(false);
    expect(tokenValido({ ...config, senha: "outra-senha" }, token, agora)).toBe(false);
    expect(tokenValido(config, "lixo", agora)).toBe(false);
    expect(tokenValido(config, undefined, agora)).toBe(false);
  });
});

describe("limiteDeTentativas", () => {
  it("bloqueia depois de 5 erros e libera depois do tempo", () => {
    const ip = "teste-ip";
    const agora = 1_000_000;
    for (let i = 0; i < 4; i++) limiteDeTentativas.registrarErro(ip, agora);
    expect(limiteDeTentativas.bloqueado(ip, agora)).toBe(0);
    limiteDeTentativas.registrarErro(ip, agora);
    expect(limiteDeTentativas.bloqueado(ip, agora)).toBeGreaterThan(0);
    expect(limiteDeTentativas.bloqueado(ip, agora + 11 * 60 * 1000)).toBe(0);
    limiteDeTentativas.limpar(ip);
  });
});
