import { NextResponse } from "next/server";
import { db, seedOnce, getUserById, updateUserProfile } from "@/mocks/db";
import { cookies, headers } from "next/headers";

async function resolveCurrentUserId(): Promise<string | null> {
    const h = await headers();
    const hdr = h.get("x-user-id");
    if (hdr) return hdr;

    const c = await cookies();
    const cookieUid = c.get("uid")?.value;
    if (cookieUid) return cookieUid;

    const fallback = db.users.find(u => u.role === "student") ?? db.users[0];
    return fallback?.id ?? null;
}

export async function GET() {
    seedOnce();
    const uid = await resolveCurrentUserId();
    if (!uid) return NextResponse.json({ error: "No user" }, { status: 401 });

    const u = getUserById(uid);
    if (!u) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatarUrl: u.avatarUrl ?? null,
    });
}

export async function PUT(req: Request) {
    seedOnce();
    const uid = await resolveCurrentUserId();
    if (!uid) return NextResponse.json({ error: "No user" }, { status: 401 });

    const body = await req.json();
    const { name, avatarUrl } = body ?? {};
    if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    const updated = updateUserProfile(uid, { name: name.trim(), avatarUrl: avatarUrl ?? null });
    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatarUrl: updated.avatarUrl ?? null,
        updatedAt: new Date().toISOString(),
    });
}