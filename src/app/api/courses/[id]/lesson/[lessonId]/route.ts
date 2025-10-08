import { NextRequest } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay, json } from "@/mocks/utils";

seedOnce();

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string; lessonId: string }> }) {
    await delay();

    const { id, lessonId } = await ctx.params;

    const lesson = db.lessons.find((l) => l.id === lessonId && l.courseId === id);
    if (!lesson) return json({ message: "Lección no encontrada" }, { status: 404 });

    return json(lesson);
}