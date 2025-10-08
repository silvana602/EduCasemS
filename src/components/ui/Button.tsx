"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    block?: boolean;
}

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const VARIANT: Record<Variant, string> = {
    primary:
        "bg-brand-600 text-white hover:bg-brand-800",
    secondary:
        "bg-surface text-fg border border-border hover:bg-brand-50",
    outline:
        "bg-transparent text-fg border border-border hover:bg-brand-50",
    ghost:
        "bg-transparent text-fg hover:bg-brand-50",
    destructive:
        "bg-red-600 text-white hover:bg-red-700",
};

const SIZE: Record<Size, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
    icon: "h-10 w-10 p-0",
};

export default function Button({
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    block,
    className,
    children,
    disabled,
    ...rest
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <button
            {...rest}
            disabled={isDisabled}
            className={cx(
                "inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
                VARIANT[variant],
                SIZE[size],
                block && "w-full",
                isDisabled && "opacity-60 cursor-not-allowed",
                className
            )}
        >
            {/* Left icon */}
            {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}

            {/* Label */}
            <span className="truncate">{children}</span>

            {/* Right icon / spinner */}
            {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
            ) : (
                rightIcon && <span className="inline-flex items-center">{rightIcon}</span>
            )}
        </button>
    );
}