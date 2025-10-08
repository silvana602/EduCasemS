import { NextRequest } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay, json } from "@/mocks/utils";

seedOnce();

export async function GET(_req: NextRequest, ctx: { params: { id: string; lessonId: string } }) {
    await delay();
    const lesson = db.lessons.find((l) => l.id === ctx.params.lessonId && l.courseId === ctx.params.id);
    if (!lesson) return json({ message: "Lección no encontrada" }, { status: 404 });
    return json(lesson);
}