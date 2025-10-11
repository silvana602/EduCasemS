"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Items } from "./Items";
import { MenuItem } from "./MenuItem";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/slices/authSlice";
import { logout as logoutReq } from "@/services/auth.service";
import UserMenu from "./UserMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";

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
    const router = useRouter();
    const qs = searchParams.toString();
    const nextFull = buildNext(pathname, qs);
    const nextQuery = nextFull ? `?next=${encodeURIComponent(nextFull)}` : "";

    const { user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();

    // Mobile menu
    const [openMobile, setOpenMobile] = useState(false);
    const mobileRef = useRef<HTMLDivElement | null>(null);
    const mobileBtnRef = useRef<HTMLButtonElement | null>(null);

    // Drawer "Explorar"
    const [exploreOpen, setExploreOpen] = useState(false);
    const exploreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setOpenMobile(false);
        setExploreOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (mobileRef.current?.contains(t) || mobileBtnRef.current?.contains(t)) return;
            if (!exploreRef.current?.contains(t)) setExploreOpen(false);
            if (!mobileRef.current?.contains(t)) setOpenMobile(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setExploreOpen(false), setOpenMobile(false));
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    async function onLogout() {
        try { await logoutReq(); } catch { }
        dispatch(logoutAction());
        setOpenMobile(false);
        router.replace("/"); // Redirige a raíz
    }

    const menuId = "navbar-mobile-menu";

    return (
        <header className="border-b border-border bg-surface">
            <div className="container mx-auto max-w-7xl px-4">
                <nav className="flex h-16 items-center gap-3">
                    {/* Izquierda: Logo + Explorar */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-semibold text-lg text-brand-800 hover:opacity-90">
                            Educasem
                        </Link>

                        {/* Botón Explorar (desktop) */}
                        <button
                            className="hidden md:inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-brand-50"
                            aria-expanded={exploreOpen}
                            aria-controls="explore-drawer"
                            onClick={() => setExploreOpen((v) => !v)}
                        >
                            Explorar
                            <svg width="16" height="16" viewBox="0 0 24 24" className="ml-1">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </button>
                    </div>

                    {/* Centro: Buscador */}
                    <div className="ml-2 hidden md:flex flex-1">
                        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                            <label className="relative block">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20l-5.99-6zM9.5 14A4.5 4.5 0 119.5 5a4.5 4.5 0 010 9z" />
                                    </svg>
                                </span>
                                <input
                                    type="search"
                                    placeholder="Buscar cualquier cosa"
                                    className="w-full rounded-full border border-border bg-surface pl-10 pr-4 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </label>
                        </form>
                    </div>

                    {/* Derecha */}
                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        <Link href="/contact" className="text-sm hover:underline">Planes y precios</Link>
                        <Link href="/about" className="text-sm hover:underline">Educasem Empresas</Link>

                        <Link href="/cart" aria-label="Carrito" className="rounded-xl p-2 hover:bg-brand-50">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14l.84-2h7.45a2 2 0 001.9-1.37l1.71-5.13A1 1 0 0018.12 4H6.21l-.31-1A1 1 0 005 2H2v2h2l3.6 9.59-.95 2.31A2 2 0 008.5 18H19v-2H8.42l.74-2h7.12" />
                            </svg>
                        </Link>

                        {/* Toggle de tema */}
                        <ThemeToggle />

                        {user ? (
                            <UserMenu />
                        ) : (
                            <>
                                <Link
                                    href={`/login${nextQuery}`}
                                    className="text-sm rounded-xl border border-brand-700 px-3 py-1 hover:bg-brand-50"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={`/register${nextQuery}`}
                                    className="text-sm rounded-xl bg-brand-600 px-3 py-1 text-white hover:bg-brand-800"
                                >
                                    Regístrate
                                </Link>
                                <button aria-label="Idioma" className="rounded-xl border border-border p-2 hover:bg-brand-50">
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm7 9a7.002 7.002 0 01-6 6.92V5.08A7.002 7.002 0 0119 12zM5 12a7.002 7.002 0 016-6.92v13.84A7.002 7.002 0 015 12z" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Botón móvil */}
                    <div className="ml-auto md:hidden">
                        <button
                            ref={mobileBtnRef}
                            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                            aria-controls={menuId}
                            aria-expanded={openMobile}
                            aria-label={openMobile ? "Cerrar menú" : "Abrir menú"}
                            onClick={() => setOpenMobile((v) => !v)}
                        >
                            <span className="inline-block align-middle">
                                {openMobile ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                                        <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                                        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                                    </svg>
                                )}
                            </span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Backdrops */}
            {openMobile && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/30"
                    aria-hidden
                    onClick={() => setOpenMobile(false)}
                />
            )}
            {exploreOpen && (
                <div
                    className="hidden md:block fixed inset-0 z-40 bg-black/30"
                    aria-hidden
                    onClick={() => setExploreOpen(false)}
                />
            )}

            {/* Drawer Explorar (desktop) */}
            <div
                id="explore-drawer"
                ref={exploreRef}
                className={`hidden md:block fixed top-16 left-0 bottom-0 z-50 w-[340px] border-r border-border bg-surface shadow-xl transition-transform duration-200 ${exploreOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                aria-hidden={!exploreOpen}
            >
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                            EX
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Hola{user ? `, ${user.name.split(" ")[0]}` : ""}
                            </p>
                            <p className="text-xs text-fg/70">
                                {user ? "¡Hola de nuevo!" : "Explora por categorías"}
                            </p>
                        </div>
                    </div>
                </div>

                <nav aria-label="Explorar" className="p-2 overflow-y-auto h-[calc(100%-64px)]">
                    <ul className="grid gap-1">
                        {Items.map((item) => (
                            <li key={item.path}>
                                <MenuItem variant="sidebar" {...item} />
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Panel móvil con usuario + cerrar sesión + ThemeToggle */}
            <div
                id={menuId}
                ref={mobileRef}
                className={`md:hidden absolute inset-x-0 top-16 z-50 px-4 transition-transform duration-200 ${openMobile ? "translate-y-0" : "-translate-y-4 pointer-events-none opacity-0"
                    }`}
            >
                <div className="container mx-auto max-w-7xl">
                    <ul className="grid gap-1 rounded-xl border border-border bg-surface p-2 shadow-lg">
                        {/* Header de usuario cuando está logueado */}
                        {user && (
                            <>
                                <li className="rounded-lg border border-border p-3">
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white text-sm font-semibold">
                                            {initials(user.name)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">{user.name}</p>
                                            <p className="truncate text-xs text-fg/70">{user.email}</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="h-px bg-border my-1" />
                            </>
                        )}

                        {/* Items de navegación */}
                        {Items.map((item) => (
                            <li key={item.path}>
                                <MenuItem variant="nav" {...item} />
                            </li>
                        ))}

                        <li className="h-px bg-border my-1" />

                        {/* Tema (toggle) */}
                        <li>
                            <div className="flex items-center justify-between px-3 py-2">
                                <span className="text-sm">Tema</span>
                                <ThemeToggle />
                            </div>
                        </li>

                        <li className="h-px bg-border my-1" />

                        {/* Acciones según sesión */}
                        {user ? (
                            <>
                                <li>
                                    <Link
                                        href="/dashboard"
                                        className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50"
                                        onClick={() => setOpenMobile(false)}
                                    >
                                        Mi aprendizaje
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/settings"
                                        className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50"
                                        onClick={() => setOpenMobile(false)}
                                    >
                                        Configuración
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={onLogout}
                                        className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-brand-50"
                                    >
                                        Cerrar sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href={`/login${nextQuery}`}
                                        className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50"
                                        onClick={() => setOpenMobile(false)}
                                    >
                                        Iniciar sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={`/register${nextQuery}`}
                                        className="block rounded-lg px-3 py-2 text-sm bg-brand-600 text-white hover:bg-brand-800"
                                        onClick={() => setOpenMobile(false)}
                                    >
                                        Regístrate
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};