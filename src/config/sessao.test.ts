import { describe, expect, it } from "vitest";
import { deveVoltarParaLogin } from "./sessao";

describe("deveVoltarParaLogin", () => {
  it("volta ao login com 401 numa página do admin", () => {
    expect(deveVoltarParaLogin(401, "/orders", "/admin/pedidos")).toBe(true);
    expect(deveVoltarParaLogin(401, "/config/settings", "/admin/config")).toBe(true);
  });

  it("ignora outros status", () => {
    expect(deveVoltarParaLogin(403, "/orders", "/admin/pedidos")).toBe(false);
    expect(deveVoltarParaLogin(500, "/orders", "/admin/pedidos")).toBe(false);
    expect(deveVoltarParaLogin(undefined, "/orders", "/admin/pedidos")).toBe(false);
  });

  it("não age fora do admin nem na própria tela de login", () => {
    expect(deveVoltarParaLogin(401, "/orders", "/finalizar")).toBe(false);
    expect(deveVoltarParaLogin(401, "/users/login", "/admin")).toBe(false);
  });

  it("não entra em loop nas chamadas de login/logout", () => {
    expect(deveVoltarParaLogin(401, "/users/logout", "/admin/pedidos")).toBe(false);
    expect(deveVoltarParaLogin(401, "/users/login", "/admin/pedidos")).toBe(false);
  });
});
