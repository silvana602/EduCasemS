"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaCircleHalfStroke } from "react-icons/fa6";

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
                <FaCircleHalfStroke />
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
                <MdLightMode />
            ) : (
                <MdDarkMode />
            )}
        </button>
    );
}