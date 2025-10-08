import { NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";

export async function POST() {
    // limpia todo
    db.users.length = 0;
    db.courses.length = 0;
    db.lessons.length = 0;
    db.progress.clear();

    // vuelve a sembrar con la versión actual del seed
    seedOnce();
    
    return NextResponse.json({ ok: true });
}