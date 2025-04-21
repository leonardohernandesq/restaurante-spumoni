import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token');
    console.log('Token via req.cookies.get:', token);

    if (
        req.nextUrl.pathname.startsWith('/admin') &&
        req.nextUrl.pathname !== '/admin' &&
        !token
    ) {
        console.log('🚫 Redirecionando para /admin');
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
