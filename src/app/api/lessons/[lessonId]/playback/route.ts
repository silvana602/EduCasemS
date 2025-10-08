import { NextRequest, NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";

seedOnce();

export async function GET(_req: NextRequest, ctx: { params: { lessonId: string } }) {
    await delay(250);
    // Solo validamos que exista la lección
    const exists = db.lessons.some((l) => l.id === ctx.params.lessonId);
    if (!exists) return NextResponse.json({ message: "Lección no encontrada" }, { status: 404 });

    // URL de ejemplo (MP4 público)
    const signedUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    return NextResponse.json({ signedUrl });
}