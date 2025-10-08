"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { register as registerReq } from "@/services/auth.service";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";

function sanitizeNext(nextRaw: string | null): string {
    const fallback = "/dashboard";
    if (!nextRaw) return fallback;
    if (!nextRaw.startsWith("/")) return fallback;
    if (nextRaw === "/login" || nextRaw.startsWith("/login/")) return fallback;
    if (nextRaw === "/register" || nextRaw.startsWith("/register/")) return fallback;
    return nextRaw;
}

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const nextPath = sanitizeNext(searchParams.get("next"));

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (pass1 !== pass2) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setLoading(true);
        try {
            const data = await registerReq({ name, email, password: pass1 });
            dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));
            router.replace(nextPath);
        } catch (err: any) {
            setError(err?.message ?? "No se pudo crear la cuenta");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-3">
            <label className="grid gap-1">
                <span className="text-sm">Nombre</span>
                <input
                    className="rounded-xl border border-border bg-surface px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                />
            </label>

            <label className="grid gap-1">
                <span className="text-sm">Correo</span>
                <input
                    type="email"
                    className="rounded-xl border border-border bg-surface px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
            </label>

            <label className="grid gap-1">
                <span className="text-sm">Contraseña</span>
                <input
                    type="password"
                    className="rounded-xl border border-border bg-surface px-3 py-2"
                    value={pass1}
                    onChange={(e) => setPass1(e.target.value)}
                    autoComplete="new-password"
                    required
                />
            </label>

            <label className="grid gap-1">
                <span className="text-sm">Repite la contraseña</span>
                <input
                    type="password"
                    className="rounded-xl border border-border bg-surface px-3 py-2"
                    value={pass2}
                    onChange={(e) => setPass2(e.target.value)}
                    autoComplete="new-password"
                    required
                />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button className="btn bg-brand-600 text-white hover:bg-brand-800" disabled={loading}>
                {loading ? "Creando..." : "Crear cuenta"}
            </button>

            <p className="text-xs text-fg/70">
                ¿Ya tienes cuenta?{" "}
                <a className="underline" href={`/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}>
                    Inicia sesión
                </a>
            </p>
        </form>
    );
}