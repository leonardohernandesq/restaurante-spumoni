import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_SESSAO,
  DURACAO_SESSAO_S,
  criarToken,
  lerConfig,
  limiteDeTentativas,
  senhaConfere,
} from "@/lib/estatisticas/sessao";

export const dynamic = "force-dynamic";

const ipDe = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "local";

/** Só aceita chamadas vindas do próprio site (bloqueia CSRF). */
const mesmaOrigem = (req: NextRequest) => {
  const origin = req.headers.get("origin");
  return !origin || origin === req.nextUrl.origin;
};

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Abre a sessão das estatísticas: { senha } → cookie httpOnly. */
export async function POST(req: NextRequest) {
  const config = lerConfig();
  if (!config) {
    return NextResponse.json(
      { message: "Estatísticas não configuradas no servidor." },
      { status: 503 },
    );
  }
  if (!mesmaOrigem(req)) {
    return NextResponse.json({ message: "Origem não permitida." }, { status: 403 });
  }
  if (!req.cookies.get("token")?.value) {
    return NextResponse.json({ message: "Faça login no admin." }, { status: 401 });
  }

  const ip = ipDe(req);
  const espera = limiteDeTentativas.bloqueado(ip);
  if (espera) {
    return NextResponse.json(
      { message: `Muitas tentativas. Tente de novo em ${Math.ceil(espera / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(espera) } },
    );
  }

  const corpo = (await req.json().catch(() => null)) as { senha?: unknown } | null;

  if (!senhaConfere(config, corpo?.senha)) {
    limiteDeTentativas.registrarErro(ip);
    await esperar(600); // atrasa tentativas automáticas
    return NextResponse.json({ message: "Senha incorreta." }, { status: 401 });
  }

  limiteDeTentativas.limpar(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESSAO, criarToken(config), {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: DURACAO_SESSAO_S,
  });
  return res;
}

/** Bloqueia de novo (botão "Bloquear"). */
export async function DELETE(req: NextRequest) {
  if (!mesmaOrigem(req)) {
    return NextResponse.json({ message: "Origem não permitida." }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESSAO, "", { path: "/", maxAge: 0 });
  return res;
}
