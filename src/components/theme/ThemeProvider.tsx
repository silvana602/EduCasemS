"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };
const ThemeCtx = createContext<Ctx | null>(null);

function initialThemeSSR(): Theme {
    // En SSR no hay window -> coincidir con <html data-theme="light">
    return "light";
}

function initialThemeCSR(): Theme {
    try {
        const attr = document.documentElement.getAttribute("data-theme");
        if (attr === "light" || attr === "dark") return attr;
        const saved = localStorage.getItem("theme") as Theme | null;
        if (saved) return saved;
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
    } catch {
        return "light";
    }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Durante SSR = "light". En el primer render en cliente, React re-ejecuta
    // el inicializador y ya usamos el valor real desde <html data-theme=...>.
    const [theme, setTheme] = useState<Theme>(
        typeof window === "undefined" ? initialThemeSSR() : initialThemeCSR()
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try { localStorage.setItem("theme", theme); } catch { }
    }, [theme]);

    const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

    return (
        <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>
            {children}
        </ThemeCtx.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeCtx);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}