"use client";

import { useState, useMemo } from "react";

export function getInitials(name?: string) {
    if (!name) return "U";
    const p = name.trim().split(/\s+/);
    return ((p[0]?.[0] ?? "U") + (p[1]?.[0] ?? "")).toUpperCase();
}

type Props = {
    name?: string;
    src?: string | null;
    size?: number;
    className?: string;
    title?: string;
    withBorder?: boolean;
};

export default function Avatar({
    name,
    src,
    size = 32,
    className = "",
    title,
    withBorder = true,
}: Props) {
    const [errored, setErrored] = useState(false);
    const canShowImg = !!src && !errored;

    const textSizeClass = useMemo(() => {
        if (size <= 20) return "text-[10px]";
        if (size <= 28) return "text-xs";
        if (size <= 36) return "text-sm";
        if (size <= 48) return "text-base";
        if (size <= 64) return "text-lg";
        if (size <= 80) return "text-xl";
        if (size <= 96) return "text-2xl";
        return "text-3xl";
    }, [size]);

    if (canShowImg) {
        return (
            <img
                src={src as string}
                alt={name ? `Avatar de ${name}` : "Avatar de usuario"}
                width={size}
                height={size}
                onError={() => setErrored(true)}
                className={`rounded-full object-cover ${withBorder ? "border border-border" : ""} ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <span
            style={{ width: size, height: size }}
            className={`grid place-items-center rounded-full bg-brand-600 text-white font-semibold ${textSizeClass} ${withBorder ? "border border-transparent" : ""} ${className}`}
            title={title ?? name}
            aria-hidden="true"
        >
            {getInitials(name)}
        </span>
    );
}