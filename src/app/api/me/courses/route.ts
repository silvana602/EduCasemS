import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

seedOnce();

export async function GET(req: NextRequest) {
    const token = req.cookies.get("refreshToken")?.value;
    const match = token?.match(/^mock-refresh-(.+)$/);
    const userId = match?.[1];
    if (!userId) return NextResponse.json({ items: [], count: 0 });

    const completed = db.progress.get(userId) ?? new Set<string>();

    const items = db.enrollments
        .filter((enr) => enr.userId === userId)
        .map((enr) => {
            const course = db.courses.find((c) => c.id === enr.courseId)!;
            const lessons = db.lessons
                .filter((l) => l.courseId === enr.courseId)
                .sort((a, b) => a.order - b.order);

            const total = lessons.length;
            const done = lessons.filter((l) => completed.has(l.id)).length;
            const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

            // next: primera lección no completada; si todas → última
            const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[lessons.length - 1];
            const firstLessonId = lessons[0]?.id;

            return {
                course,
                total,
                completed: done,
                progressPct,
                lastLessonId: enr.lastLessonId ?? firstLessonId,
                nextLessonId: next?.id ?? firstLessonId,
                firstLessonId,
            };
        });

    return NextResponse.json({ items, count: items.length });
}