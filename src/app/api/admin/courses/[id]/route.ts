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
    const courses = Array.isArray((db as any)?.courses) ? (db as any).courses : [];
    const idx = courses.findIndex((c: any) => has(c, "id") && String(c.id) === params.id);
    if (idx === -1) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

    const curr = courses[idx];
    const next = {
        ...curr,
        ...(has(body, "status") ? { status: (body as any).status } : {}),
        ...(has(body, "title") ? { title: (body as any).title } : {}),
        ...(has(body, "instructorId") ? { instructorId: (body as any).instructorId } : {}),
    };
    courses[idx] = next;
    return NextResponse.json(next);
}