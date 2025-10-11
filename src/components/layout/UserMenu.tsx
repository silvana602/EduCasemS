"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/slices/authSlice";
import { logout as logoutReq } from "@/services/auth.service";
import { useRouter } from "next/navigation";

function initials(name?: string) {
    if (!name) return "U";
    const p = name.trim().split(/\s+/);
    return (p[0]?.[0] ?? "U") + (p[1]?.[0] ?? "");
}

export default function UserMenu() {
    const { user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);

    const close = useCallback(() => setOpen(false), []);
    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (ref.current?.contains(t) || btnRef.current?.contains(t)) return;
            close();
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [close]);

    async function onLogout() {
        try { await logoutReq(); } catch { }
        dispatch(logoutAction());
        router.replace("/"); // Redirige a raíz
    }

    if (!user) return null;

    return (
        <div className="relative" ref={ref}>
            <button
                ref={btnRef}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1 hover:bg-brand-50"
            >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white text-xs font-semibold">
                    {initials(user.name)}
                </span>
            </button>

            {open && (
                <div
                    role="menu"
                    aria-label="Menú de usuario"
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-lg z-50"
                >
                    <div className="flex items-center gap-3 px-3 py-2">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                            {initials(user.name)}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-fg/70">{user.email}</p>
                        </div>
                    </div>

                    <div className="h-px bg-border my-1" />

                    <Link role="menuitem" href="/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">
                        Mi aprendizaje
                    </Link>
                    <Link role="menuitem" href="/settings" className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">
                        Configuración
                    </Link>

                    <div className="h-px bg-border my-1" />

                    <button
                        role="menuitem"
                        onClick={onLogout}
                        className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-brand-50"
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}