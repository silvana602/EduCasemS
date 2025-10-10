import { NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { resetUid } from "@/mocks/utils";

export async function POST() {
    // limpia todo
    db.users.length = 0;
    db.courses.length = 0;
    db.sections.length = 0;
    db.lessons.length = 0;
    db.enrollments.length = 0;
    db.progress.clear();

    // reinicia flags/counters globales
    (globalThis as any).__EDU_MOCKS_SEEDED__ = false;
    resetUid(0);

    seedOnce(); // nuevo seed limpio
    return NextResponse.json({ ok: true });
}