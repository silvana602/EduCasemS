import { NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { cookies, headers } from "next/headers";

async function currentUserId(): Promise<string | null> {
    const h = await headers();
    const hdr = h.get("x-user-id");
    if (hdr) return hdr;

    const c = await cookies();
    const cookieUid = c.get("uid")?.value;
    if (cookieUid) return cookieUid;

    const fallback = db.users.find(u => u.role === "student") ?? db.users[0];
    return fallback?.id ?? null;
}

export async function POST(req: Request) {
    seedOnce();

    const uid = await currentUserId();
    if (!uid) return NextResponse.json({ ok: false, message: "No user" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (typeof newPassword !== "string" || newPassword.length < 8) {
        return NextResponse.json(
            { ok: false, message: "La nueva contraseña debe tener 8+ caracteres." },
            { status: 400 }
        );
    }

    const saved = db.passwords.get(uid);
    if (!saved || saved !== currentPassword) {
        return NextResponse.json(
            { ok: false, message: "La contraseña actual es incorrecta." },
            { status: 400 }
        );
    }

    db.passwords.set(uid, newPassword);
    return NextResponse.json({ ok: true, message: "Contraseña actualizada." });
}