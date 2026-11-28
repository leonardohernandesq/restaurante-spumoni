import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // /admin raiz → tela de login (ou lista de pedidos, se já logado)
  if (pathname === "/admin") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/pedidos", req.url));
    }
    return NextResponse.next();
  }

  // /admin/* → precisa de token
  if (pathname.startsWith("/admin/") && !token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
