export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let _i = 0;
export const uid = (p = "id") => `${p}_${++_i}`;

export function json<T>(data: T, init?: ResponseInit) {
    return Response.json(data, init);
}