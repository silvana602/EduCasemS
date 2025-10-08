import { NextRequest } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay, json } from "@/mocks/utils";

seedOnce();

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
    await delay();
    const course = db.courses.find((c) => c.id === ctx.params.id);
    if (!course) return json({ message: "Curso no encontrado" }, { status: 404 });

    const lessons = db.lessons
        .filter((l) => l.courseId === course.id)
        .sort((a, b) => a.order - b.order);

    return json({ ...course, lessons });
}