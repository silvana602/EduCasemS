"use client";

import RoleGate from "@/components/auth/RoleGate";
import { useEffect, useState } from "react";
import { getJson } from "@/services/http";

type InstructorDash = {
    cards: {
        myCourses: number;
        activeStudents: number;
        assignmentsToReview: number;
        forumRepliesPending: number;
    };
    myCourses: Array<{ id: string; title: string; progressAvg: number; students: number }>;
    recentSubmissions: Array<{ id: string; student: string; course: string; assignment: string; ts: string }>;
};

export default function InstructorPage() {
    const [data, setData] = useState<InstructorDash | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        // Si deseas forzar un instructor concreto en dev: "/api/instructor/dashboard?instructorId=xyz"
        getJson<InstructorDash>("/api/instructor/dashboard")
            .then(setData)
            .catch((e) => setErr(e.message));
    }, []);

    return (
        <RoleGate allow={["instructor", "admin"]} fallback="/">
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Panel de Instructor</h1>

                {!data && !err && <div className="opacity-70 text-sm">Cargando…</div>}
                {err && <div className="text-red-600 text-sm">Error: {err}</div>}

                {data && (
                    <>
                        <section className="grid gap-4 md:grid-cols-4">
                            <Stat label="Mis cursos" value={data.cards.myCourses} />
                            <Stat label="Estudiantes activos" value={data.cards.activeStudents} />
                            <Stat label="Tareas por revisar" value={data.cards.assignmentsToReview} />
                            <Stat label="Respuestas de foro" value={data.cards.forumRepliesPending} />
                        </section>

                        <section className="grid gap-6 md:grid-cols-2">
                            <Card title="Mis cursos">
                                <ul className="divide-y divide-border/70">
                                    {data.myCourses.map((c) => (
                                        <li key={c.id} className="py-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{c.title}</span>
                                                <span className="opacity-70">{c.students} estudiantes</span>
                                            </div>
                                            <div className="mt-2 h-2 rounded bg-border">
                                                <div
                                                    className="h-2 rounded bg-fg"
                                                    style={{ width: `${c.progressAvg}%` }}
                                                    aria-label={`Progreso promedio ${c.progressAvg}%`}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card title="Entregas recientes">
                                <ul className="divide-y divide-border/70">
                                    {data.recentSubmissions.map((s) => (
                                        <li key={s.id} className="py-3 text-sm">
                                            <span className="font-medium">{s.student}</span>{" "}
                                            <span className="opacity-70">— {s.assignment} ({s.course})</span>
                                            <div className="opacity-60 text-xs">{new Date(s.ts).toLocaleString()}</div>
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
        <div className="rounded-2xl border p-4">
            <div className="text-xs uppercase opacity-70">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
    );
}

function Card({ title, children }: React.PropsWithChildren<{ title: string }>) {
    return (
        <div className="rounded-2xl border">
            <div className="px-4 py-3 border-b">
                <h2 className="text-sm font-semibold">{title}</h2>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}