"use client";

import { RoleGate } from "@/components/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/instructor", label: "Resumen" },
    { href: "/instructor/courses", label: "Mis cursos" },
    { href: "/instructor/submissions", label: "Entregas" },
    { href: "/instructor/settings", label: "Ajustes" },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <RoleGate allow={["instructor", "admin"]}>
            <div className="space-y-4">
                <nav aria-label="Instructor" className="rounded-2xl border border-border bg-surface p-2">
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