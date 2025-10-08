import { NextRequest } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay, json, slugify } from "@/mocks/utils";

seedOnce();

export async function GET(_req: NextRequest) {
    await delay(200);

    const map = new Map<string, number>();
    for (const c of db.courses) {
        map.set(c.category, (map.get(c.category) || 0) + 1);
    }

    const items = [...map.entries()].map(([name, count]) => ({
        name,
        slug: slugify(name),
        count,
    }));

    return json({ items });
}