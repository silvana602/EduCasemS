// src/app/api/me/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

seedOnce();

export async function GET(req: NextRequest) {
    // usuario mock desde cookie refresh
    const token = req.cookies.get("refreshToken")?.value;
    const userId = token?.match(/^mock-refresh-(.+)$/)?.[1];
    if (!userId) return NextResponse.json({ items: [] });

    const completed = db.progress.get(userId) ?? new Set<string>();

    // Lecciones aplanadas por curso en orden (sección -> lección)
    function flatLessons(courseId: string) {
        const secs = db.sections
            .filter((s) => s.courseId === courseId)
            .sort((a, b) => a.order - b.order);

        const bySection = secs.map((s) =>
            db.lessons
                .filter((l) => l.sectionId === s.id)
                .sort((a, b) => a.order - b.order)
        );

        return bySection.flat();
    }

    const items = db.enrollments
        .filter((e) => e.userId === userId)
        .map((e) => {
            const course = db.courses.find((c) => c.id === e.courseId)!;
            const lessons = flatLessons(e.courseId);

            const total = lessons.length;
            const completedCount = lessons.filter((l) => completed.has(l.id)).length;
            const progressPct = total ? Math.round((completedCount / total) * 100) : 0;

            const firstLessonId = lessons[0]?.id ?? null;

            // siguiente correlativa: primera NO completada; si todas hechas, la última
            const next = lessons.find((l) => !completed.has(l.id)) ?? lessons.at(-1);
            const nextLessonId = next?.id ?? null;

            return {
                course,
                total,              // 👈 lo que usa tu Dashboard
                completed: completedCount, // 👈 idem
                progressPct,
                firstLessonId,      // 👈 idem
                nextLessonId,       // 👈 idem
            };
        });

    return NextResponse.json({ items });
}