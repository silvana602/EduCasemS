export async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(path, { cache: "no-store", ...init });
    if (!res.ok) throw new Error(`Error ${res.status} al cargar ${path}`);
    return (await res.json()) as T;
}