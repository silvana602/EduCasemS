"use client";

import { RoleGate } from "@/components/auth";
import { useEffect, useState } from "react";
import { getJson } from "@/services/http";

type AdminDash = {
    cards: {
        totalUsers: number;
        activeStudents: number;
        instructors: number;
        courses: number;
        pendingApprovals: number;
    };
    recentActivity: Array<{ id: string; type: string; ts: string;[k: string]: any }>;
    topCourses: Array<{ id: string; title: string; enrollments: number }>;
};

export default function AdminPage() {
    const [data, setData] = useState<AdminDash | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        getJson<AdminDash>("/api/admin/dashboard")
            .then(setData)
            .catch((e) => setErr(e.message));
    }, []);

    return (
        <RoleGate allow={["admin"]} fallback="/">
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Panel de Administración</h1>

                {!data && !err && <div className="opacity-70 text-sm">Cargando…</div>}
                {err && <div className="text-red-600 text-sm">Error: {err}</div>}

                {data && (
                    <>
                        <section className="grid gap-4 md:grid-cols-5">
                            <Stat label="Usuarios" value={data.cards.totalUsers} />
                            <Stat label="Estudiantes activos" value={data.cards.activeStudents} />
                            <Stat label="Instructores" value={data.cards.instructors} />
                            <Stat label="Cursos" value={data.cards.courses} />
                            <Stat label="Pendientes" value={data.cards.pendingApprovals} />
                        </section>

                        <section className="grid gap-6 md:grid-cols-2">
                            <Card title="Actividad reciente">
                                <ul className="divide-y divide-border/70">
                                    {data.recentActivity.map((a) => (
                                        <li key={a.id} className="py-3 text-sm">
                                            <span className="font-medium">{a.type}</span>{" "}
                                            <span className="opacity-70">— {new Date(a.ts).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card title="Top cursos por inscripciones">
                                <ul className="divide-y divide-border/70">
                                    {data.topCourses.map((c) => (
                                        <li key={c.id} className="py-3 text-sm flex items-center justify-between">
                                            <span className="font-medium">{c.title}</span>
                                            <span className="opacity-70">{c.enrollments} inscripciones</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </section>
                    </>
                )}
            </div>
        </RoleGate>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-xs uppercase opacity-70">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
    );
}

function Card({ title, children }: React.PropsWithChildren<{ title: string }>) {
    return (
        <div className="rounded-2xl border border-border bg-surface">
            <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold">{title}</h2>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}