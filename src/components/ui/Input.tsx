"use client";

import { forwardRef, type InputHTMLAttributes, type JSX } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
    containerClassName?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, hint, error, leftIcon, rightIcon, className, containerClassName, ...props },
    ref
) {
    // Fuerza booleanos para evitar uniones raras en las clases
    const hasLeft = !!leftIcon;
    const hasRight = !!rightIcon;

    return (
        <label className={cn("grid gap-1", containerClassName)}>
            {label && <span className="text-sm">{label}</span>}

            <div className="relative">
                {hasLeft && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/70">
                        {leftIcon}
                    </span>
                )}

                <input
                    ref={ref}
                    {...props}
                    aria-invalid={error ? true : undefined}
                    className={cn(
                        "w-full rounded-xl border bg-surface px-3 py-2 outline-none transition-colors focus:ring-2 focus:ring-brand-500",
                        error ? "border-red-500" : "border-border",
                        hasLeft && "pl-9",
                        hasRight && "pr-9",
                        className
                    )}
                />

                {hasRight && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-fg/70">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error ? (
                <span className="text-xs text-red-600">{error}</span>
            ) : hint ? (
                <span className="text-xs text-fg/60">{hint}</span>
            ) : null}
        </label>
    );
});

Input.displayName = "Input";

export default Input;