import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce, getUserByEmail } from "@/mocks/db";
import { delay } from "@/mocks/utils";
import type { AuthResponse } from "@/types";

seedOnce();

export async function POST(req: NextRequest) {
    await delay();

    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string") {
        return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
        return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const saved = db.passwords.get(user.id);
    if (!saved || saved !== password) {
        return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const accessToken = `mock-access-${user.id}-${Date.now()}`;
    const res = NextResponse.json<AuthResponse>({
        accessToken,
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

    res.cookies.set("uid", user.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return res;
}