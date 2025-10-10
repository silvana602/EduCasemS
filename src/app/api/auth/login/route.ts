import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";
import type { AuthResponse, MockUser } from "@/types";

seedOnce();

export async function POST(req: NextRequest) {
    await delay();

    const { email, password } = await req.json();

    // db.users es User[], pero aquí necesitamos la password del mock
    const user = (db.users as MockUser[]).find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const accessToken = `mock-access-${user.id}-${Date.now()}`;
    const res = NextResponse.json<AuthResponse>({
        accessToken,
        // devolvemos el shape público (sin password)
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl ?? null,
        },
    });

    res.cookies.set("refreshToken", `mock-refresh-${user.id}`, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return res;
}