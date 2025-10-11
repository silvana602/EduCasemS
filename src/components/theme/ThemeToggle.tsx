"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggle } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Botón neutral durante la hidratación para evitar mismatch
    if (!mounted) {
        return (
            <button
                onClick={toggle}
                aria-label="Cambiar tema"
                title="Cambiar tema"
                className="rounded-xl border border-border p-2 hover:bg-brand-50"
                suppressHydrationWarning
            >
                {/* Icono neutral (círculo) */}
                <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>
            </button>
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className="rounded-xl border border-border p-2 hover:bg-brand-50"
            suppressHydrationWarning
        >
            {isDark ? (
                /* Sol */
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.07.05l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17 13h3v-2h-3v2zM4.96 19.05l-1.79 1.79 1.79 1.79 1.79-1.79-1.79-1.79zM11 23h2v-3h-2v3zm7.07-3.95l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM12 6a6 6 0 100 12A6 6 0 0012 6z" />
                </svg>
            ) : (
                /* Luna */
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M12 2a9.93 9.93 0 00-7.07 2.93A10 10 0 1012 2zm0 18a8 8 0 01-5.66-13.66A10 10 0 0012 20z" />
                </svg>
            )}
        </button>
    );
}