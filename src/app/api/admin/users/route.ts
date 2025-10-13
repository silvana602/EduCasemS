import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";

type Role = "student" | "instructor" | "admin";

function qstr(v: unknown, f = ""): string {
    return v == null ? f : String(v);
}
function qnum(v: unknown, f = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : f;
}
function has<K extends string>(o: unknown, k: K): o is Record<K, unknown> {
    return !!o && typeof o === "object" && k in (o as object);
}

export async function GET(req: NextRequest) {
    await delay?.();
    seedOnce?.();

    const url = new URL(req.url);
    const search = qstr(url.searchParams.get("search")).toLowerCase();
    const role = qstr(url.searchParams.get("role"));
    const activeStr = qstr(url.searchParams.get("active")); // "true" | "false" | ""
    const page = Math.max(1, qnum(url.searchParams.get("page"), 1));
    const pageSize = Math.min(100, Math.max(1, qnum(url.searchParams.get("pageSize"), 10)));

    const all = Array.isArray((db as any)?.users) ? (db as any).users : [];

    let filtered = all.filter((u: any) => {
        const matchSearch =
            !search ||
            qstr(has(u, "name") ? u.name : "")
                .toLowerCase()
                .includes(search) ||
            qstr(has(u, "email") ? u.email : "")
                .toLowerCase()
                .includes(search);

        const matchRole = !role || (has(u, "role") && u.role === role);

        let matchActive = true;
        if (activeStr === "true") matchActive = (has(u, "isActive") ? (u as any).isActive : true) === true;
        if (activeStr === "false") matchActive = (has(u, "isActive") ? (u as any).isActive : true) === false;

        return matchSearch && matchRole && matchActive;
    });

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return NextResponse.json({
        page,
        pageSize,
        total,
        items,
    });
}