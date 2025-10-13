"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

type Role = "student" | "instructor" | "admin";

interface Props extends PropsWithChildren {
    allow: Role[];
    fallback?: string;
    loadingUI?: React.ReactNode;
}

function buildNext(pathname: string | null): string {
    if (!pathname) return "/";
    if (pathname === "/login" || pathname.startsWith("/login")) return "/dashboard";
    if (pathname === "/register" || pathname.startsWith("/register")) return "/dashboard";
    return pathname;
}

export default function RoleGate({ allow, fallback = "/", loadingUI, children }: Props) {
    const { user, accessToken } = useAppSelector((s) => s.auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // No token o no user -> redirige a login con next
        if (!user || !accessToken) {
            const next = encodeURIComponent(buildNext(pathname));
            router.replace(`/login?next=${next}`);
            return;
        }
        // Tiene sesión pero no el rol requerido
        if (!allow.includes(user.role as Role)) {
            router.replace(fallback);
        }
    }, [user, accessToken, allow, router, pathname, fallback]);

    if (!user || !accessToken) {
        return <>{loadingUI ?? <div className="p-6 text-sm opacity-70">Verificando sesión…</div>}</>;
    }
    if (!allow.includes(user.role as Role)) {
        return null;
    }
    return <>{children}</>;
}