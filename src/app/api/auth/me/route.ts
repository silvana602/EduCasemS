import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

seedOnce();

/**
 * Lee la cookie refreshToken del request, extrae el userId (mock),
 * busca el usuario en la "DB" y lo devuelve. Si no hay cookie/usuario → 401.
 */
export async function GET(req: NextRequest) {
    const token = req.cookies.get("refreshToken")?.value;
    if (!token) return NextResponse.json({ message: "No session" }, { status: 401 });

    // Formato del mock: "mock-refresh-<userId>"
    const match = token.match(/^mock-refresh-(.+)$/);
    const userId = match?.[1];
    if (!userId) return NextResponse.json({ message: "Bad token" }, { status: 401 });

    const user = db.users.find((u) => u.id === userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 401 });

    // No exponemos password en la respuesta
    const { password, ...safe } = user as any;
    return NextResponse.json({ user: safe });
}