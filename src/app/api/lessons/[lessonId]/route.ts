import { NextRequest } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay, json } from "@/mocks/utils";

seedOnce();

export async function GET(_req: NextRequest, ctx: { params: Promise<{ lessonId: string }> }) {
    await delay(150);
    const { lessonId } = await ctx.params;
    const lesson = db.lessons.find((l) => l.id === lessonId);
    if (!lesson) return json({ message: "Lección no encontrada" }, { status: 404 });
    return json(lesson);
}