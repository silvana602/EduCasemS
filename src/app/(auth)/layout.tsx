import type { Metadata } from "next";
import "@/app/globals.css";
import { isAuthenticatedServer } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: { default: "Acceso", template: "%s | Educasem" },
    description: "Inicia sesión o crea tu cuenta para acceder a Educasem",
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    // Si ya hay sesión, redirige al dashboard
    if (await isAuthenticatedServer()) redirect("/dashboard");

    return (
        <div className="grid place-items-center bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
            <div className="w-full max-w-md px-4">
                <div className="mb-6 text-center">
                    <a href="/" className="inline-block text-2xl font-bold text-brand-heading">Educasem</a>
                    <p className="text-sm text-fg/70">Plataforma educativa de Cecasem</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    {children}
                </div>
                <p className="mt-4 text-center text-xs text-fg/60">
                    Al continuar aceptas nuestros <a href="/terms" className="underline">Términos</a> y <a href="/privacy" className="underline">Políticas de privacidad</a>.
                </p>
            </div>
        </div>
    );
}