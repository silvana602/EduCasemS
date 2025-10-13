import { NextResponse } from "next/server";
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";

/**
 * Devuelve métricas globales para el panel de administración,
 * calculadas desde el seed (db en memoria).
 */
export async function GET() {
    await delay?.();
    seedOnce?.();

    // Totales base (sólidos)
    const users = Array.isArray(db?.users) ? db.users : [];
    const courses = Array.isArray(db?.courses) ? db.courses : [];

    const totalUsers = users.length;
    const activeStudents = users.filter(u => u?.role === "student" && u?.isActive !== false).length;
    const instructors = users.filter(u => u?.role === "instructor").length;

    // Pendientes (si tu modelo tiene estados; si no, cae en 0)
    const pendingApprovals =
        courses.filter((c: any) => (c?.status ?? "").toLowerCase() === "pending").length ?? 0;

    // Actividad reciente
    // 1) Si hay enrollments en tu seed:
    const enrollments = Array.isArray((db as any)?.enrollments) ? (db as any).enrollments : [];
    const actFromEnrollments = enrollments
        .slice(-10) // últimas 10
        .reverse()
        .map((e: any, i: number) => ({
            id: `enr-${e?.id ?? i}`,
            type: "enrollment",
            user: e?.studentEmail ?? e?.studentId ?? "estudiante",
            course: e?.courseTitle ?? e?.courseId ?? "curso",
            ts: e?.createdAt ?? e?.timestamp ?? new Date().toISOString(),
        }));

    // 2) Fallback adicional: altas de cursos si tienen createdAt
    const actFromCourses = courses
        .slice(-10)
        .reverse()
        .map((c: any, i: number) => ({
            id: `course-${c?.id ?? i}`,
            type: "course_created",
            course: c?.title ?? c?.name ?? "Curso",
            requestedBy: users.find(u => u?.id === c?.instructorId)?.email ?? "instructor",
            ts: c?.createdAt ?? new Date().toISOString(),
        }));

    const recentActivity = (actFromEnrollments.length ? actFromEnrollments : actFromCourses).slice(0, 10);

    // Top cursos por inscripciones
    let topCourses: Array<{ id: string; title: string; enrollments: number }> = [];
    if (enrollments.length) {
        const count: Record<string, number> = {};
        for (const e of enrollments) {
            const cid = String(e?.courseId ?? e?.courseTitle ?? "");
            if (!cid) continue;
            count[cid] = (count[cid] ?? 0) + 1;
        }
        topCourses = Object.entries(count)
            .map(([cid, n]) => {
                const c = courses.find((x: any) => String(x?.id) === cid || String(x?.title) === cid);
                return {
                    id: String(c?.id),
                    title: String(c?.title),
                    enrollments: n,
                };
            })
            .sort((a, b) => b.enrollments - a.enrollments)
            .slice(0, 5);
    } else {
        // fallback por si no hay enrollments
        topCourses = courses
            .map((c: any, i: number) => ({
                id: String(c?.id ?? i),
                title: String(c?.title ?? c?.name ?? `Curso #${i + 1}`),
                enrollments: Number(c?.popularity ?? c?.enrollments ?? 0),
            }))
            .sort((a, b) => b.enrollments - a.enrollments)
            .slice(0, 5);
    }

    return NextResponse.json({
        cards: { totalUsers, activeStudents, instructors, courses: courses.length, pendingApprovals },
        recentActivity,
        topCourses,
    });
}