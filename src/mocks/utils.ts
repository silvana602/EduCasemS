export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let _i = 0;
export const uid = (p = "id") => `${p}_${++_i}`;

export function json<T>(data: T, init?: ResponseInit) {
    return Response.json(data, init);
}

// util para URLs de categorías
export function slugify(s: string) {
    return s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}