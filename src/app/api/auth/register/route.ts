import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay, uid } from "@/mocks/utils";
import type { AuthResponse, MockUser } from "@/types";

seedOnce();

export async function POST(req: NextRequest) {
    await delay();

    const { name, email, password } = await req.json();

    const exists = (db.users as MockUser[]).some((u) => u.email === email);
    if (exists) {
        return NextResponse.json({ message: "Email ya registrado" }, { status: 409 });
    }

    const user: MockUser = {
        id: uid("usr"),
        name,
        email,
        role: "student",
        password,            // solo vive en el mock
        avatarUrl: null,
    };

    // Aunque db.users es User[], MockUser es asignable (tiene superset de props)
    (db.users as MockUser[]).push(user);

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
        maxAge: 60 * 60 * 24 * 7,
    });

    return res;
}