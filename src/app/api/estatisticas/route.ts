import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO, lerConfig, tokenValido } from "@/lib/estatisticas/sessao";
import { calcularEstatisticas, type StatsRaw } from "@/domain/estatisticas";
import {
  PRESETS,
  periodoDoPreset,
  periodoPersonalizado,
  validarIntervalo,
  type PeriodoComparado,
  type PresetPeriodo,
} from "@/domain/periodo";
import { todaySaoPaulo } from "@/domain/datetime";

export const dynamic = "force-dynamic";

const json = (corpo: unknown, status = 200) =>
  NextResponse.json(corpo, { status, headers: { "Cache-Control": "no-store" } });

const isPreset = (v: string | null): v is PresetPeriodo =>
  PRESETS.some((p) => p.tipo === v);

/**
 * GET /api/estatisticas?periodo=hoje|semana|mes|trimestre|ano
 * GET /api/estatisticas?periodo=personalizado&de=YYYY-MM-DD&ate=YYYY-MM-DD
 * &finalizados=1 → conta só pedidos finalizados.
 *
 * Exige o login do admin (cookie `token`, validado pela API PHP) e a sessão
 * das estatísticas (senha). Devolve só agregados: nada de nome/telefone.
 */
export async function GET(req: NextRequest) {
  const config = lerConfig();
  if (!config) {
    return json({ motivo: "config", message: "Estatísticas não configuradas no servidor." }, 503);
  }

  const tokenAdmin = req.cookies.get("token")?.value;
  if (!tokenAdmin) return json({ motivo: "login", message: "Faça login no admin." }, 401);

  if (!tokenValido(config, req.cookies.get(COOKIE_SESSAO)?.value)) {
    return json({ motivo: "senha", message: "Digite a senha das estatísticas." }, 403);
  }

  const params = req.nextUrl.searchParams;
  const hoje = todaySaoPaulo();
  const tipo = params.get("periodo") ?? "mes";

  let periodo: PeriodoComparado;
  if (tipo === "personalizado") {
    const de = params.get("de");
    const ate = params.get("ate");
    const erro = validarIntervalo(de, ate, hoje);
    if (erro) return json({ motivo: "periodo", message: erro }, 400);
    periodo = periodoPersonalizado({ de: de as string, ate: ate as string });
  } else if (isPreset(tipo)) {
    periodo = periodoDoPreset(tipo, hoje);
  } else {
    return json({ motivo: "periodo", message: "Período inválido." }, 400);
  }

  // Uma busca só cobre o período anterior e o atual
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/stats/pedidos`);
  url.searchParams.set("de", periodo.anterior.de);
  url.searchParams.set("ate", periodo.atual.ate);

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      headers: {
        Cookie: `token=${encodeURIComponent(tokenAdmin)}`,
        "X-Stats-Key": config.chaveApi,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    console.error("Estatísticas: API fora do ar", error);
    return json({ motivo: "api", message: "Não foi possível falar com o servidor." }, 502);
  }

  if (resposta.status === 401) {
    return json({ motivo: "login", message: "Sessão do admin expirou." }, 401);
  }
  if (!resposta.ok) {
    // 403 aqui = chave diferente entre Next e PHP (configuração)
    console.error("Estatísticas: API respondeu", resposta.status);
    return json({ motivo: "api", message: "Erro ao buscar os dados." }, 502);
  }

  const raw = (await resposta.json()) as StatsRaw;
  const estatisticas = calcularEstatisticas(raw, periodo.atual, periodo.anterior, {
    somenteFinalizados: params.get("finalizados") === "1",
  });

  return json({ periodo, estatisticas, geradoEm: new Date().toISOString() });
}
