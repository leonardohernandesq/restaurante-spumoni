import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log(`[MIDDLEWARE] Request to: ${pathname}`);
  console.log(`[MIDDLEWARE] Token found: ${!!token}`);

  // /admin raiz → login
  if (pathname === "/admin") {
    if (token) {
      console.log("[MIDDLEWARE] Token exists → redirect to /admin/pedidos");
      return NextResponse.redirect(new URL("/admin/pedidos", req.url));
    }
    return NextResponse.next(); // mostra login
  }

  // /admin subpages → precisa de token
  if (pathname.startsWith("/admin/")) {
    if (!token) {
      console.log("[MIDDLEWARE] No token → redirect to /admin (login)");
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    console.log("[MIDDLEWARE] Token exists → allow access to subpage");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
