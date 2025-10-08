import { NextRequest } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay, json } from "@/mocks/utils";

seedOnce();

export async function GET(req: NextRequest) {
    await delay();
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 12);

    let items = db.courses;
    if (q) {
        items = items.filter(
            (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const data = items.slice(start, start + pageSize);

    return json({ items: data, total, page, pageSize });
}