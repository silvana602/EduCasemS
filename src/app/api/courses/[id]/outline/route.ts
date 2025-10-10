import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

seedOnce();

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;

    const token = req.cookies.get("refreshToken")?.value;
    const userId = token?.match(/^mock-refresh-(.+)$/)?.[1];
    const completed = userId ? (db.progress.get(userId) ?? new Set<string>()) : new Set<string>();

    const sections = db.sections
        .filter((s) => s.courseId === id)
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
            id: s.id,
            title: s.title,
            order: s.order,
            lessons: db.lessons
                .filter((l) => l.sectionId === s.id)
                .sort((a, b) => a.order - b.order)
                .map((l) => ({
                    id: l.id,
                    title: l.title,
                    order: l.order,
                    durationMin: l.durationMin,
                    completed: completed.has(l.id),
                })),
        }));

    return NextResponse.json({ sections });
}