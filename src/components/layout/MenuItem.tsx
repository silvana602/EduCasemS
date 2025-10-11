"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";

type Variant = "nav" | "sidebar";

interface Props {
    path: string;
    icon: JSX.Element;
    title: string;
    subTitle?: string;
    variant?: Variant;
}

function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export const MenuItem = ({ path, icon, title, subTitle, variant = "nav" }: Props) => {
    const pathname = usePathname();
    const active = pathname === path || pathname?.startsWith(path + "/");

    const base =
        "flex items-center gap-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500";
    const spacing = "px-3 py-2";
    const idle = "text-fg hover:bg-brand-soft";
    const activeClass = "bg-brand-50 text-brand-heading font-medium";

    return (
        <Link
            href={path}
            aria-current={active ? "page" : undefined}
            className={cx(base, spacing, active ? activeClass : idle)}
        >
            <span className={cx("shrink-0", active ? "text-brand-heading" : "text-brand-600")}>
                {icon}
            </span>

            <span className="flex flex-col">
                <span className={cx("leading-5", variant === "nav" ? "text-sm" : "text-base")}>
                    {title}
                </span>
                {variant === "sidebar" && subTitle && (
                    <span className="text-xs text-fg/70">{subTitle}</span>
                )}
            </span>
        </Link>
    );
};