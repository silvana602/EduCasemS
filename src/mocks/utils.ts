export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const G = globalThis as any;
if (typeof G.__EDU_UID__ !== "number") G.__EDU_UID__ = 0;

/** Reinicia el contador (lo usa el reset en dev) */
export function resetUid(n = 0) {
    (globalThis as any).__EDU_UID__ = n;
}

export const uid = (p = "id") => `${p}_${++(globalThis as any).__EDU_UID__}`;

export function json<T>(data: T, init?: ResponseInit) {
    return Response.json(data, init);
}

export function slugify(s: string) {
    return s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}