"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";
type ToastId = string;

export interface ToastOptions {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number; // ms
    action?: { label: string; onClick: () => void };
}

export interface ToastApi {
    toast: (opts: ToastOptions) => ToastId;
    dismiss: (id: ToastId) => void;
    clear: () => void;
}

interface ToastItem extends Required<ToastOptions> {
    id: ToastId;
    createdAt: number;
}

const ToastCtx = createContext<ToastApi | null>(null);

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const palette: Record<ToastVariant, string> = {
    default: "bg-surface text-fg border border-border",
    success: "bg-emerald-50 text-emerald-900 border border-emerald-200",
    error: "bg-red-50 text-red-900 border border-red-200",
    warning: "bg-amber-50 text-amber-900 border border-amber-200",
    info: "bg-sky-50 text-sky-900 border border-sky-200",
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);
    const idRef = useRef(0);

    const toast = useCallback((opts: ToastOptions) => {
        const id = `t_${++idRef.current}`;
        const item: ToastItem = {
            id,
            title: opts.title ?? "",
            description: opts.description ?? "",
            variant: opts.variant ?? "default",
            duration: Math.max(1000, opts.duration ?? 3500),
            action: opts.action ?? { label: "", onClick: () => { } },
            createdAt: Date.now(),
        };
        setItems((prev) => [...prev.slice(-4), item]); // máx 5
        return id;
    }, []);

    const dismiss = useCallback((id: ToastId) => {
        setItems((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    // Autocierre
    useEffect(() => {
        const timers = items.map((t) =>
            setTimeout(() => dismiss(t.id), t.duration)
        );
        return () => timers.forEach(clearTimeout);
    }, [items, dismiss]);

    const api = useMemo<ToastApi>(() => ({ toast, dismiss, clear }), [toast, dismiss, clear]);

    return (
        <ToastCtx.Provider value={api}>
            {children}
            <ToastViewport items={items} onDismiss={dismiss} />
        </ToastCtx.Provider>
    );
}

export function useToast(): ToastApi {
    const ctx = useContext(ToastCtx);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

/** Contenedor de toasts. Lo monta el provider automáticamente */
export function ToastViewport({
    items,
    onDismiss,
}: {
    items: ToastItem[];
    onDismiss: (id: ToastId) => void;
}) {
    return (
        <div className="fixed inset-x-0 bottom-4 z-[60] grid place-items-center px-4 pointer-events-none">
            <div className="grid w-full max-w-sm gap-2">
                {items.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        aria-live="polite"
                        className={cx(
                            "pointer-events-auto rounded-xl p-4 shadow-lg",
                            palette[t.variant]
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className="grow min-w-0">
                                {t.title && <p className="text-sm font-semibold">{t.title}</p>}
                                {t.description && <p className="mt-0.5 text-sm/5 text-current/80">{t.description}</p>}
                            </div>
                            <button
                                onClick={() => onDismiss(t.id)}
                                className="rounded-md px-2 py-1 text-sm text-current/80 hover:bg-black/5"
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>
                        {t.action.label && (
                            <button
                                onClick={t.action.onClick}
                                className="mt-2 rounded-lg border border-current/20 px-3 py-1 text-sm hover:bg-black/5"
                            >
                                {t.action.label}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}