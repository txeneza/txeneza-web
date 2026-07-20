import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercetar páginas sob /admin (exceto estáticos / _next)
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("txeneza_session");
    
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
      // Verificar se possui o papel de admin e se o email não é uma heurística fraca
      if (!sessionData || sessionData.role !== "admin") {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
