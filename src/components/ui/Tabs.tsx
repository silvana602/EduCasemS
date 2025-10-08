"use client";

import { useId, useState, type ReactNode } from "react";

type Variant = "underline" | "pill";
type Color = "brand" | "neutral";

export interface TabItem {
    value: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
}

export interface TabsProps {
    items: TabItem[];
    defaultValue?: string;
    value?: string; // controlado
    onValueChange?: (value: string) => void;
    variant?: Variant;
    color?: Color;
}

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function Tabs({
    items,
    defaultValue,
    value,
    onValueChange,
    variant = "underline",
    color = "brand",
}: TabsProps) {
    const id = useId();
    const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
    const current = value ?? internal;

    function setValue(v: string) {
        setInternal(v);
        onValueChange?.(v);
    }

    const activeColor =
        color === "brand" ? "text-brand-800" : "text-fg";
    const activeIndicator =
        color === "brand" ? "bg-brand-600" : "bg-fg/80";

    return (
        <div>
            {/* List */}
            <div role="tablist" aria-orientation="horizontal" className="flex items-center gap-1 overflow-x-auto">
                {items.map((it) => {
                    const active = current === it.value;
                    return (
                        <button
                            key={it.value}
                            role="tab"
                            aria-selected={active}
                            aria-controls={`${id}-${it.value}`}
                            disabled={it.disabled}
                            onClick={() => !it.disabled && setValue(it.value)}
                            className={cx(
                                "relative rounded-xl px-3 py-2 text-sm transition-colors",
                                it.disabled && "opacity-50 cursor-not-allowed",
                                active ? cx(activeColor, variant === "pill" && "bg-brand-50") : "text-fg/70 hover:text-fg"
                            )}
                        >
                            {it.label}
                            {variant === "underline" && (
                                <span
                                    className={cx(
                                        "absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full transition-opacity",
                                        active ? cx("opacity-100", activeIndicator) : "opacity-0"
                                    )}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Panels */}
            <div className="mt-3">
                {items.map((it) => {
                    const active = current === it.value;
                    return (
                        <div
                            key={it.value}
                            id={`${id}-${it.value}`}
                            role="tabpanel"
                            hidden={!active}
                            className="focus:outline-none"
                        >
                            {active && it.content}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}