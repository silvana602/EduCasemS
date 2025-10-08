import { NextResponse, type NextRequest } from "next/server";

/**
 * Nombre de la cookie que usamos como “señal de sesión”.
 * Debe coincidir con lo que ponen los mocks /api/auth/login y /api/auth/register.
 */
const REFRESH_COOKIE_NAME = "refreshToken";

// Rutas públicas de auth (sin prefijo)
const AUTH_ROUTES = ["/login", "/register"] as const;

// Prefijos de secciones privadas (requieren sesión)
const PROTECTED_PREFIXES = ["/dashboard", "/instructor", "/admin"] as const;

/** Devuelve true si el path empieza por alguno de los prefijos /dashboard, /instructor, /admin */
function isProtectedPath(pathname: string) {
    return PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );
}

/** Devuelve true si el path es /login o /register */
function isAuthRoute(pathname: string) {
    return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const hasSession = Boolean(req.cookies.get(REFRESH_COOKIE_NAME)?.value);

    // 1) Si intenta entrar a secciones protegidas sin sesión → redirigir a /login?next=<ruta>
    if (isProtectedPath(pathname) && !hasSession) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        // preserva la ruta original para volver luego de loguearse
        url.searchParams.set("next", pathname + (search || ""));
        return NextResponse.redirect(url);
    }

    // 2) Si ya hay sesión y visita /login o /register → llevar a /dashboard
    if (hasSession && isAuthRoute(pathname)) {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        url.search = ""; // limpia query para no arrastrar ?next
        return NextResponse.redirect(url);
    }

    // 3) En cualquier otro caso, continuar
    return NextResponse.next();
}

/**
 * Importante: excluimos assets, _next, y /api (para que la Mock API no pase por el middleware).
 * Si más adelante sirves otros archivos estáticos, añádelos aquí.
 */
export const config = {
    matcher: [
        // Aplica a todo MENOS lo excluido en el negative lookahead
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets/).*)",
    ],
};