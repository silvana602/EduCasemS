"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Items } from "./Items";
import { MenuItem } from "./MenuItem";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/slices/authSlice";
import { logout as logoutReq } from "@/services/auth.service";

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

export const Navbar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const qs = searchParams.toString();
    const nextFull = buildNext(pathname, qs);
    const nextQuery = nextFull ? `?next=${encodeURIComponent(nextFull)}` : "";

    const [open, setOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const userRef = useRef<HTMLDetailsElement | null>(null);
    const menuId = "navbar-mobile-menu";
    const user = useAppSelector((s) => s.auth.user);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        setOpen(false);
        setUserOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                setUserOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!open && !userOpen) return;
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
            if (userRef.current?.contains(t)) return;
            setOpen(false);
            setUserOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open, userOpen]);

    async function onLogout() {
        try { await logoutReq(); } catch { }
        dispatch(logoutAction());
        router.replace("/login");
    }

    return (
        <header className="border-b border-border bg-surface">
            <div className="container mx-auto max-w-7xl px-4">
                <nav className="flex h-14 items-center justify-between" aria-label="Barra principal">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="font-semibold text-lg text-brand-800 hover:opacity-90">Educasem</Link>
                    </div>

                    <ul className="hidden md:flex items-center gap-2">
                        {Items.map((item) => (
                            <li key={item.path}>
                                <MenuItem variant="nav" {...item} />
                            </li>
                        ))}
                    </ul>

                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <details
                                ref={userRef}
                                open={userOpen}
                                onToggle={(e) => setUserOpen((e.target as HTMLDetailsElement).open)}
                                className="relative"
                            >
                                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1 hover:bg-brand-50">
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white text-xs font-semibold">
                                        {initials(user.name)}
                                    </span>
                                    <span className="text-sm">{user.name}</span>
                                </summary>
                                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg z-50">
                                    <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">Ir al dashboard</Link>
                                    <button onClick={onLogout} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-brand-50">
                                        Cerrar sesión
                                    </button>
                                </div>
                            </details>
                        ) : (
                            <>
                                <Link href={`/login${nextQuery}`} className="text-sm rounded-md border border-border px-3 py-1 hover:bg-brand-50">
                                    Ingresar
                                </Link>
                                <Link href={`/register${nextQuery}`} className="text-sm rounded-md bg-brand-600 px-3 py-1 text-white hover:bg-brand-800">
                                    Crear cuenta
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Botón móvil */}
                    <button
                        ref={btnRef}
                        className="md:hidden rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                        aria-controls={menuId}
                        aria-expanded={open}
                        aria-label={open ? "Cerrar menú" : "Abrir menú"}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <span className="inline-block align-middle">
                            {open ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" /></svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" /></svg>
                            )}
                        </span>
                    </button>
                </nav>
            </div>

            {open && <div className="md:hidden fixed inset-0 z-40 bg-black/30" aria-hidden onClick={() => setOpen(false)} />}

            <div
                id={menuId}
                ref={panelRef}
                className={`md:hidden absolute inset-x-0 top-14 z-50 px-4 transition-transform duration-200 ${open ? "translate-y-0" : "-translate-y-4 pointer-events-none opacity-0"}`}
            >
                <div className="container mx-auto max-w-7xl">
                    <ul className="grid gap-1 rounded-xl border border-border bg-surface p-2 shadow-lg">
                        {Items.map((item) => (
                            <li key={item.path}>
                                <MenuItem variant="nav" {...item} />
                            </li>
                        ))}
                        <li className="h-px bg-border my-1" />
                        {user ? (
                            <>
                                <li><Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">Ir al dashboard</Link></li>
                                <li><button onClick={onLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-brand-50">Cerrar sesión</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link href={`/login${nextQuery}`} className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">Ingresar</Link></li>
                                <li><Link href={`/register${nextQuery}`} className="block rounded-lg px-3 py-2 text-sm bg-brand-600 text-white hover:bg-brand-800">Crear cuenta</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};