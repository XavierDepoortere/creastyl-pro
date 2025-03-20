import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  console.log(
    "Middleware called for path:",
    pathname,
    "with query:",
    request.nextUrl.search
  );
  if (pathname === "/register" && search.includes("token=")) {
    return NextResponse.next();
  }
  // Vérifiez s'il s'agit de la première visite sur l'application
  if (pathname === "/") {
    try {
      // Vérifier directement s'il existe un superadministrateur
      const response = await fetch(
        `${request.nextUrl.origin}/api/check-superadmin`
      );

      if (!response.ok) {
        return NextResponse.redirect(new URL("/setup", request.url));
      }

      const data = await response.json();

      // Si aucun superadministrateur n'existe, redirigez vers setup
      if (!data.hasSuperAdmin) {
        return NextResponse.redirect(new URL("/setup", request.url));
      }
    } catch (error) {
      // S'il y a une erreur, redirigez vers setup
      return NextResponse.redirect(new URL("/setup", request.url));
    }
  }

  // Protéger les routes d'administration
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Vérifiez si l'utilisateur a le rôle d'administrateur
    if (token.role !== "ADMIN" && token.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - register (registration page)
     * - setup (initial setup page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|setup).*)",
  ],
};
