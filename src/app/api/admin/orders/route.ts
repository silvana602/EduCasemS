import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";

function qstr(v: unknown, f = ""): string { return v == null ? f : String(v); }
function qnum(v: unknown, f = 0): number { const n = Number(v); return Number.isFinite(n) ? n : f; }
function has<K extends string>(o: unknown, k: K): o is Record<K, unknown> {
    return !!o && typeof o === "object" && k in (o as object);
}

export async function GET(req: NextRequest) {
    await delay?.();
    seedOnce?.();
    const url = new URL(req.url);
    const status = qstr(url.searchParams.get("status")); // paid|pending|refunded|canceled
    const page = Math.max(1, qnum(url.searchParams.get("page"), 1));
    const pageSize = Math.min(100, Math.max(1, qnum(url.searchParams.get("pageSize"), 10)));

    const orders = Array.isArray((db as any)?.orders) ? (db as any).orders : [];
    const users = Array.isArray((db as any)?.users) ? (db as any).users : [];

    const filtered = orders.filter((o: any) => !status || (has(o, "status") && o.status === status));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize).map((o: any) => ({
        id: qstr(has(o, "id") ? o.id : ""),
        status: qstr(has(o, "status") ? o.status : "pending"),
        amountBOB: Number(has(o, "amountBOB") ? o.amountBOB : 0),
        studentId: qstr(has(o, "studentId") ? o.studentId : ""),
        studentEmail: (() => {
            const u = users.find((uu: any) => has(uu, "id") && qstr(uu.id) === qstr(o.studentId));
            return u && has(u, "email") ? String(u.email) : "";
        })(),
        createdAt: qstr(has(o, "createdAt") ? o.createdAt : ""),
    }));

    return NextResponse.json({ page, pageSize, total, items });
}