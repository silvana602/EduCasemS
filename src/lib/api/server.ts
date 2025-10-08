import "server-only";
import { headers } from "next/headers";

export type ServerFetchInit = RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
};

/**
 * Construye SIEMPRE una URL absoluta y reenvía la cookie de la request.
 * Funciona tanto con base relativa (ej. "/api") como absoluta (https://api...).
 */
export async function serverFetch<T = any>(
    endpoint: string,
    init: ServerFetchInit = {}
): Promise<T> {
    const baseEnv = process.env.NEXT_PUBLIC_API_URL ?? "/api";
    const base = baseEnv.replace(/\/$/, "");
    const h = await headers();

    // origin de la request actual
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const origin = `${proto}://${host}`;

    // URL absoluta
    const url = /^https?:\/\//i.test(base)
        ? new URL(endpoint, base).toString()
        : new URL(`${base}${endpoint}`, origin).toString();

    // Reenviar cookie (para endpoints user-specific como /me/courses)
    const cookie = h.get("cookie") ?? "";
    const merged = new Headers(init.headers || {});
    if (cookie && !merged.has("cookie")) merged.set("cookie", cookie);

    const res = await fetch(url, { ...init, headers: merged });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}