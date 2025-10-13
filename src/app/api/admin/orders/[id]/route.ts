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

    const orders = Array.isArray((db as any)?.orders) ? (db as any).orders : [];
    const idx = orders.findIndex((o: any) => has(o, "id") && String(o.id) === params.id);
    if (idx === -1) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });

    const curr = orders[idx];
    const next = {
        ...curr,
        ...(has(body, "status") ? { status: (body as any).status } : {}),
    };
    orders[idx] = next;
    return NextResponse.json(next);
}