"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RoleGate from "@/components/auth/RoleGate";

const links = [
    { href: "/admin", label: "Resumen" },
    { href: "/admin/users", label: "Usuarios" },
    { href: "/admin/courses", label: "Cursos" },
    { href: "/admin/orders", label: "Órdenes" },
    { href: "/admin/settings", label: "Configuración" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <RoleGate allow={["admin"]}>
            <div className="space-y-4">
                <nav aria-label="Admin" className="rounded-2xl border border-border bg-surface p-2">
                    <ul className="flex flex-wrap gap-1">
                        {links.map((l) => {
                            const active = pathname === l.href;
                            return (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className={`px-3 py-1.5 rounded-xl text-sm ${active ? "bg-brand-600 text-white" : "hover:bg-brand-50 border border-transparent"
                                            }`}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div>{children}</div>
            </div>
        </RoleGate>
    );
}