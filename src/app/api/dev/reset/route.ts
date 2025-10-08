import { NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { resetUid } from "@/mocks/utils";

export async function POST() {
    // limpiar estructuras
    db.users.length = 0;
    db.courses.length = 0;
    db.lessons.length = 0;
    db.enrollments.length = 0;
    db.progress.clear();

    // resetear flags/counters globales
    (globalThis as any).__EDU_MOCKS_SEEDED__ = false;
    resetUid(0);

    // seed fresco
    seedOnce();
    return NextResponse.json({ ok: true });
}