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
    const search = qstr(url.searchParams.get("search")).toLowerCase();
    const status = qstr(url.searchParams.get("status")); // draft|published|pending
    const page = Math.max(1, qnum(url.searchParams.get("page"), 1));
    const pageSize = Math.min(100, Math.max(1, qnum(url.searchParams.get("pageSize"), 10)));

    const courses = Array.isArray((db as any)?.courses) ? (db as any).courses : [];
    const users = Array.isArray((db as any)?.users) ? (db as any).users : [];

    const filtered = courses.filter((c: any) => {
        const title = qstr(has(c, "title") ? c.title : has(c, "name") ? c.name : "").toLowerCase();
        const matchSearch = !search || title.includes(search);
        const matchStatus = !status || (has(c, "status") && c.status === status);
        return matchSearch && matchStatus;
    });

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize).map((c: any) => ({
        id: String(has(c, "id") ? c.id : ""),
        title: qstr(has(c, "title") ? c.title : has(c, "name") ? c.name : "Curso"),
        status: qstr(has(c, "status") ? c.status : "draft"),
        instructorId: qstr(has(c, "instructorId") ? c.instructorId : ""),
        instructorEmail: (() => {
            const u = users.find((uu: any) => has(uu, "id") && String(uu.id) === qstr(c.instructorId));
            return u && has(u, "email") ? String(u.email) : "";
        })(),
        enrollments: qnum(has(c, "enrollments") ? c.enrollments : has(c, "popularity") ? c.popularity : 0),
        createdAt: qstr(has(c, "createdAt") ? c.createdAt : ""),
    }));

    return NextResponse.json({ page, pageSize, total, items });
}