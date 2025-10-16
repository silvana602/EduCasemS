"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/auth.service";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";
import Link from "next/link";

function sanitizeNext(nextRaw: string | null): string {
    // Fallback vacío para poder aplicar landing por rol
    if (!nextRaw) return "";
    // Solo permitimos rutas internas
    if (!nextRaw.startsWith("/")) return "";
    // Evitar bucles hacia /login o /register
    if (nextRaw === "/login" || nextRaw.startsWith("/login/")) return "";
    if (nextRaw === "/register" || nextRaw.startsWith("/register/")) return "";
    return nextRaw;
}

function roleLanding(role?: string): string {
    switch (role) {
        case "admin":
            return "/admin";
        case "instructor":
            return "/instructor";
        case "student":
        default:
            return "/dashboard";
    }
}

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const nextPath = sanitizeNext(searchParams.get("next"));

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await login({ email, password });
            dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));

            const target = nextPath || roleLanding(data?.user?.role);
            router.replace(target);
        } catch (err: any) {
            setError(err?.message ?? "No se pudo iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-3">
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
                <div className="relative">
                    <input
                        type={show ? "text" : "password"}
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-fg/70"
                    >
                        {show ? "Ocultar" : "Ver"}
                    </button>
                </div>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button className="btn bg-brand-600 text-white hover:bg-brand-800" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <p className="text-xs text-fg/70">
                ¿No tienes cuenta?{" "}
                <Link className="underline" href={`/register${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}>
                    Regístrate
                </Link>
            </p>
        </form>
    );
}