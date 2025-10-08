import type { HTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...rest}
            className={cx(
                "rounded-2xl border border-border bg-surface shadow-sm",
                className
            )}
        />
    );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return <div {...rest} className={cx("p-5 pb-0", className)} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
    return <h3 {...rest} className={cx("text-base font-semibold", className)} />;
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
    return <p {...rest} className={cx("mt-1 text-sm text-fg/70", className)} />;
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return <div {...rest} className={cx("p-5", className)} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return <div {...rest} className={cx("p-5 pt-0", className)} />;
}

export default { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };