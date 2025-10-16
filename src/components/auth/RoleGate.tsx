"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Role } from "@/types";

interface Props extends PropsWithChildren {
    allow: Role[];
    fallback?: string;
    loadingUI?: React.ReactNode;
}

function roleLanding(role?: string): string {
    switch (role) {
        case "admin": return "/admin";
        case "instructor": return "/instructor";
        default: return "/dashboard";
    }
}
function buildNext(pathname: string | null): string {
    if (!pathname) return "/";
    if (pathname === "/login" || pathname?.startsWith("/login")) return "/dashboard";
    if (pathname === "/register" || pathname?.startsWith("/register")) return "/dashboard";
    return pathname;
}

export const RoleGate = ({ allow, fallback, loadingUI, children }: Props) => {
    const { user, hydrated } = useAppSelector((s) => s.auth);
    const router = useRouter();
    const pathname = usePathname();

    // Efecto de redirecciones
    useEffect(() => {
        if (!hydrated) return;

        // Sin sesión (o inactivo) -> login con next
        if (!user || user.isActive === false) {
            const next = encodeURIComponent(buildNext(pathname));
            router.replace(`/login?next=${next}`);
            return;
        }

        // Rol no permitido -> a su landing natural
        if (!allow.includes(user.role as Role)) {
            router.replace(fallback ?? roleLanding(user.role));
            return;
        }
    }, [hydrated, user, allow, router, pathname, fallback]);

    // UI
    if (!hydrated) {
        return <>{loadingUI ?? <div className="p-6 text-sm opacity-70">Verificando sesión…</div>}</>;
    }
    if (!user || user.isActive === false) return null;
    if (!allow.includes(user.role as Role)) return null;

    return <>{children}</>;
}