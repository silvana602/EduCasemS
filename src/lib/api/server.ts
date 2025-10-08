import "server-only";
import { headers } from "next/headers";

export type ServerFetchInit = RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
};

export async function serverFetch<T = any>(
    endpoint: string,
    init: ServerFetchInit = {}
): Promise<T> {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    let url: string;

    if (/^https?:\/\//i.test(base)) {
        // Base absoluta
        url = `${base}${endpoint}`;
    } else {
        // Base relativa ("/api") → construir origen desde headers
        const h = await headers();
        const proto = h.get("x-forwarded-proto") ?? "http";
        const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
        const origin = `${proto}://${host}`;
        url = new URL(`${base}${endpoint}`, origin).toString();
    }

    const res = await fetch(url, init);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}