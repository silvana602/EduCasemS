import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";

function has<K extends string>(o: unknown, k: K): o is Record<K, unknown> {
    return !!o && typeof o === "object" && k in (o as object);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await delay?.();
    seedOnce?.();

    const body = await req.json().catch(() => ({} as any));
    const users = Array.isArray((db as any)?.users) ? (db as any).users : [];
    const idx = users.findIndex((u: any) => has(u, "id") && String(u.id) === params.id);
    if (idx === -1) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const current = users[idx];
    const next = {
        ...current,
        ...(has(body, "isActive") ? { isActive: !!(body as any).isActive } : {}),
        ...(has(body, "role") ? { role: (body as any).role } : {}),
        ...(has(body, "name") ? { name: (body as any).name } : {}),
        ...(has(body, "email") ? { email: (body as any).email } : {}),
        ...(has(body, "avatarUrl") ? { avatarUrl: (body as any).avatarUrl } : {}),
    };
    users[idx] = next;
    return NextResponse.json(next);
}