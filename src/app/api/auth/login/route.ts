import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";
import type { AuthResponse } from "@/mocks/types";

seedOnce();

export async function POST(req: NextRequest) {
    await delay();
    const { email, password } = await req.json();

    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) {
        return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const accessToken = `mock-access-${user.id}-${Date.now()}`;
    const res = NextResponse.json<AuthResponse>({ accessToken, user });
    res.cookies.set("refreshToken", `mock-refresh-${user.id}`, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    return res;
}