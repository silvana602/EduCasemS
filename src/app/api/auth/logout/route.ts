import { NextResponse } from "next/server";

/** Limpia la cookie del refresh token del mock y responde 204 */
export async function POST() {
    const res = new NextResponse(null, { status: 204 });
    res.cookies.set("refreshToken", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 0,
    });
    return res;
}