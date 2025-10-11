"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutReq } from "@/services/auth.service";
import { useAppDispatch } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/slices/authSlice";

export default function DevBanner() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    async function onReset() {
        if (loading) return;
        setLoading(true);
        try {
            // Ejecuta ambas acciones en paralelo (y no falla si una da error)
            await Promise.allSettled([
                logoutReq(),                                   // limpia cookie HttpOnly
                fetch("/api/dev/reset", { method: "POST" }),   // reseed
            ]);
            dispatch(logoutAction());                        // limpia Redux
            router.replace("/login");                        // vuelve a /login
        } catch (e) {
            // En dev, un alert simple basta
            alert("No se pudo reiniciar el seed. Revisa la consola.");
            // console.error(e);
        } finally {
            setLoading(false);
            router.refresh();
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-[70] rounded-xl border border-border bg-surface/95 backdrop-blur px-3 py-2 shadow-lg">
            <div className="flex items-center gap-3">
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-heading">DEV</span>
                <button
                    onClick={onReset}
                    disabled={loading}
                    className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800 disabled:opacity-60"
                >
                    {loading ? "Reiniciando…" : "Resembrar datos + Logout"}
                </button>
            </div>
        </div>
    );
}