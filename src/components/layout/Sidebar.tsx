"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Items } from "./Items";
import { MenuItem } from "./MenuItem";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/slices/authSlice";
import { logout as logoutReq } from "@/services/auth.service";
import Link from "next/link";

function initials(name?: string) {
    if (!name) return "U";
    const p = name.trim().split(/\s+/);
    return (p[0]?.[0] ?? "U") + (p[1]?.[0] ?? "");
}
function buildNext(pathname: string | null, qs: string): string | "" {
    if (!pathname) return "";
    if (pathname === "/login" || pathname === "/register") return "";
    const full = qs ? `${pathname}?${qs}` : pathname;
    return full;
}

export default function Sidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const qs = searchParams.toString();
    const nextFull = buildNext(pathname, qs);
    const nextQuery = nextFull ? `?next=${encodeURIComponent(nextFull)}` : "";

    if (pathname?.startsWith("/admin") || pathname?.startsWith("/instructor")) return null;

    const [open, setOpen] = useState(false);
    const user = useAppSelector((s) => s.auth.user);
    const dispatch = useAppDispatch();

    useEffect(() => setOpen(false), [pathname]);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    async function onLogout() {
        try { await logoutReq(); } catch { }
        dispatch(logoutAction());
    }

    return (
        <aside className="lg:w-64 lg:shrink-0">
            {/* Trigger móvil */}
            <div className="lg:hidden mb-3">
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="sidebar-menu"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                >
                    {open ? "Ocultar menú" : "Mostrar menú"}
                </button>
            </div>

            {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/30" aria-hidden onClick={() => setOpen(false)} />}

            <div
                id="sidebar-menu"
                className={
                    open
                        ? "lg:static fixed left-4 right-4 top-24 z-50 rounded-2xl border border-border bg-surface p-3 shadow-lg"
                        : "hidden lg:block rounded-2xl border border-border bg-surface p-3"
                }
            >
                {/* Usuario */}
                <div className="mb-3 rounded-xl border border-border bg-surface p-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                                {initials(user.name)}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{user.name}</p>
                                <p className="truncate text-xs text-fg/70">{user.email}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="ml-auto rounded-lg border border-border px-3 py-1 text-xs hover:bg-brand-50"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={`/login${nextQuery}`} className="rounded-lg border border-border px-3 py-1 text-sm hover:bg-brand-50">
                                Ingresar
                            </Link>
                            <Link href={`/register${nextQuery}`} className="rounded-lg bg-brand-600 px-3 py-1 text-sm text-white hover:bg-brand-800">
                                Crear cuenta
                            </Link>
                        </div>
                    )}
                </div>

                {/* Menú */}
                <nav aria-label="Menú lateral">
                    <ul className="grid">
                        {Items.map((item) => (
                            <li key={item.path}>
                                <MenuItem variant="sidebar" {...item} />
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}