import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const sessionCookie = request.cookies.get("txeneza_session");

  let sessionData: { uid?: string; email?: string | null; role?: string } | null = null;

  if (sessionCookie?.value) {
    try {
      sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      sessionData = null;
    }
  }

  const isAdmin = sessionData?.role === "admin";

  // 1. Se o utilizador aceder à página de login (/login) e já possuir sessão de administrador ativa:
  if (pathname === "/login") {
    if (isAdmin) {
      const redirectTarget = searchParams.get("redirect");
      const destination = redirectTarget && redirectTarget.startsWith("/admin")
        ? redirectTarget
        : "/admin";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // 2. Intercetar páginas sob /admin (requer autenticação de administrador)
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
  ],
};
