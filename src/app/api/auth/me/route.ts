import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

// Debe coincidir con el nombre de cookie que setean tus mocks de login
const REFRESH_COOKIE_NAME = "refreshToken";

// Para el mock actual usamos "mock-refresh-<userId>"
const MOCK_PREFIX = "mock-refresh-";

export async function GET(req: NextRequest) {
    // Asegura que el seed esté cargado
    seedOnce?.();

    const token = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    if (!token) {
        // 👉 Sin sesión: 204 (No Content)
        return new Response(null, { status: 204 });
    }

    // Token mock esperado: "mock-refresh-<userId>"
    if (!token.startsWith(MOCK_PREFIX)) {
        return new Response(null, { status: 204 });
    }
    const userId = token.slice(MOCK_PREFIX.length);
    if (!userId) {
        return new Response(null, { status: 204 });
    }

    const user = db.users.find((u) => u.id === userId);
    if (!user) {
        return new Response(null, { status: 204 });
    }

    // Sanitiza (en tu DB real la contraseña no está en users, pero por si acaso)
    const { password, ...safe } = user as any;

    // ✅ Sesión válida
    return NextResponse.json({ user: safe }, { status: 200 });
}