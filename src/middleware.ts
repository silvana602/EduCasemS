import { NextResponse, type NextRequest } from "next/server";

/** Nombre de la cookie que señaliza sesión (debe coincidir con tus mocks de login) */
const REFRESH_COOKIE_NAME = "refreshToken";

/** Rutas públicas de auth (sin prefijo) */
const AUTH_ROUTES = ["/login", "/register"] as const;

/** Prefijos de secciones privadas (requieren sesión) */
const PROTECTED_PREFIXES = ["/dashboard", "/instructor", "/admin"] as const;

/** Devuelve true si el path empieza por alguno de los prefijos protegidos */
function isProtectedPath(pathname: string) {
    return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const isProtected = isProtectedPath(pathname);

    // Si no es una ruta protegida, continuar
    if (!isProtected) return NextResponse.next();

    // ¿Hay cookie de sesión?
    const hasSession = Boolean(req.cookies.get(REFRESH_COOKIE_NAME)?.value);

    if (!hasSession) {
        // 👉 Sin sesión en ruta protegida: redirige a /login con ?next=<ruta>
        const loginUrl = new URL("/login", req.url);
        const next = pathname + (search || "");
        loginUrl.searchParams.set("next", next);
        return NextResponse.redirect(loginUrl);
    }

    // Con sesión: continuar
    return NextResponse.next();
}

/**
 * Importante: excluimos assets, _next y /api (para que la Mock API no pase por el middleware).
 */
export const config = {
    matcher: [
        // Aplica a todo MENOS lo excluido en el negative lookahead
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets/).*)",
    ],
};