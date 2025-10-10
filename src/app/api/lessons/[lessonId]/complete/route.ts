import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

seedOnce();

export async function POST(req: NextRequest, ctx: { params: Promise<{ lessonId: string }> }) {
    const { lessonId } = await ctx.params;

    const token = req.cookies.get("refreshToken")?.value;
    const userId = token?.match(/^mock-refresh-(.+)$/)?.[1];
    if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

    const lesson = db.lessons.find((l) => l.id === lessonId);
    if (!lesson) return NextResponse.json({ ok: false, message: "Lección no existe" }, { status: 404 });

    const set = db.progress.get(userId) ?? new Set<string>();
    set.add(lessonId);
    db.progress.set(userId, set);

    return NextResponse.json({ ok: true });
}