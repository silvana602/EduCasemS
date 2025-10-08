export async function clientFetch<T = any>(endpoint: string, init: RequestInit = {}): Promise<T> {
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(base + endpoint, {
        cache: "no-store",
        credentials: "include",                 // importante para cookies HttpOnly
        headers: { "Content-Type": "application/json", ...(init.headers || {}) },
        ...init,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}