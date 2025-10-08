"use client";

import { useEffect, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Size = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    size?: Size;
    children: ReactNode;
    dismissable?: boolean;
    className?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const SIZES: Record<Size, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

/**
 * Hook conveniente para controlar un modal desde el cliente.
 * Uso:
 *   const modal = useModal();
 *   <Button onClick={modal.onOpen}>Abrir</Button>
 *   <Modal open={modal.open} onOpenChange={modal.setOpen}>...</Modal>
 */
export function useModal(initial = false) {
    const [open, setOpen] = useState<boolean>(initial);

    const api = useMemo(
        () => ({
            open,
            setOpen,
            onOpen: () => setOpen(true),
            onClose: () => setOpen(false),
            onToggle: () => setOpen((v) => !v),
        }),
        [open]
    );

    return api;
}

export default function Modal({
    open,
    onOpenChange,
    title,
    description,
    size = "md",
    children,
    dismissable = true,
    className,
}: ModalProps) {
    // Bloquear scroll del body cuando está abierto
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Cerrar con ESC (si es dismissable)
    useEffect(() => {
        if (!open || !dismissable) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, dismissable, onOpenChange]);

    if (typeof window === "undefined" || !open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-desc" : undefined}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => dismissable && onOpenChange(false)}
            />
            {/* Panel */}
            <div className="absolute inset-0 grid place-items-center p-4">
                <div
                    className={cn(
                        "w-full rounded-2xl border border-border bg-surface shadow-xl",
                        SIZES[size],
                        className
                    )}
                >
                    {(title || description) && (
                        <div className="px-5 pt-5">
                            {title && (
                                <h2 id="modal-title" className="text-lg font-semibold text-brand-800">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p id="modal-desc" className="mt-1 text-sm text-fg/70">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="p-5">{children}</div>
                </div>
            </div>
        </div>,
        document.body
    );
}

/** Pie de acciones opcional para modales */
export function ModalActions({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...rest}
            className={cn("flex justify-end gap-2 border-t border-border p-4 pt-3", className)}
        />
    );
}