import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

seedOnce();

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;

    const token = req.cookies.get("refreshToken")?.value;
    const userId = token?.match(/^mock-refresh-(.+)$/)?.[1];
    if (!userId) return NextResponse.json({ message: "No session" }, { status: 401 });

    const course = db.courses.find((c) => c.id === id);
    if (!course) return NextResponse.json({ message: "Curso no encontrado" }, { status: 404 });

    const exists = db.enrollments.some((e) => e.userId === userId && e.courseId === course.id);
    if (!exists) {
        const first = db.lessons.filter((l) => l.courseId === course.id).sort((a, b) => a.order - b.order)[0];
        db.enrollments.push({ userId, courseId: course.id, lastLessonId: first?.id });
    }

    return NextResponse.json({ ok: true });
}