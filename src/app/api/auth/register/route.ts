import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";
import { uid } from "@/mocks/utils";
import type { AuthResponse, User } from "@/mocks/types";

seedOnce();

export async function POST(req: NextRequest) {
    await delay();
    const { name, email, password } = await req.json();

    const exists = db.users.some((u) => u.email === email);
    if (exists) return NextResponse.json({ message: "Email ya registrado" }, { status: 409 });

    const user: User = { id: uid("usr"), name, email, role: "student", password };
    db.users.push(user);

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