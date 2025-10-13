import type { LoginDto, RegisterDto, AuthResponse, User } from "@/types";
import { clientFetch } from "@/lib/api/client";

/** Normaliza avatarUrl y garantiza isActive por defecto */
function normalizeUser(u: any): User {
    return {
        id: String(u.id),
        name: String(u.name),
        email: String(u.email),
        role: u.role,
        avatarUrl: typeof u?.avatarUrl === "string" && u.avatarUrl.startsWith("/images/") ? null : (u?.avatarUrl ?? null),
        isActive: (u as any)?.isActive ?? true,
    } as User;
}

/** POST /auth/login  -> AuthResponse { user, accessToken? } */
export async function login(body: LoginDto): Promise<AuthResponse> {
    const res = await clientFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
    });
    const user = normalizeUser(res.user);
    if ((user as any).isActive === false) {
        throw new Error("Tu cuenta está desactivada. Contacta al administrador.");
    }
    return { user, accessToken: res.accessToken ?? null };
}

/** POST /auth/register -> AuthResponse { user, accessToken? } */
export async function register(body: RegisterDto): Promise<AuthResponse> {
    const res = await clientFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
    });
    const user = normalizeUser(res.user);
    if ((user as any).isActive === false) {
        throw new Error("Tu cuenta está desactivada. Contacta al administrador.");
    }
    return { user, accessToken: res.accessToken ?? null };
}

/** POST /auth/logout */
export async function logout(): Promise<void> {
    await clientFetch("/auth/logout", { method: "POST" });
}

/** GET /auth/me -> { user } | 204 -> null */
export async function me(): Promise<User | null> {
    try {
        const res = await clientFetch<{ user: User }>("/auth/me", { method: "GET" });
        return normalizeUser(res.user);
    } catch {
        return null;
    }
}