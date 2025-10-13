import { NextRequest, NextResponse } from "next/server";
// Ajusta estas rutas si tu seed vive en otra carpeta:
import { db, seedOnce } from "@/mocks/db";
import { delay } from "@/mocks/utils";

/**
 * Devuelve métricas para el panel de instructor.
 * Detecta el instructor así (en orden):
 *   1) Encabezado "x-user-id"
 *   2) Query param "?instructorId=..."
 *   3) Primer usuario con role "instructor" del seed
 */
export async function GET(req: NextRequest) {
    await delay?.();
    seedOnce?.();

    const users = Array.isArray(db?.users) ? db.users : [];
    const courses = Array.isArray(db?.courses) ? db.courses : [];
    const submissions = Array.isArray((db as any)?.submissions) ? (db as any).submissions : [];
    const enrollments = Array.isArray((db as any)?.enrollments) ? (db as any).enrollments : [];

    // Resolver instructor
    const hUser = req.headers.get("x-user-id");
    const url = new URL(req.url);
    const qInstructor = url.searchParams.get("instructorId");
    const instructor =
        users.find(u => u?.id === hUser) ??
        users.find(u => u?.id === qInstructor) ??
        users.find(u => u?.role === "instructor");

    if (!instructor) {
        return NextResponse.json(
            { error: "No se encontró un instructor en el seed. Agrega uno al db.seed." },
            { status: 400 }
        );
    }

    // Cursos del instructor
    const myCourses = courses.filter((c: any) => c?.instructorId === instructor.id);

    // Estudiantes activos
    const myCourseIds = new Set(myCourses.map((c: any) => String(c?.id)));
    const activeStudentsFromEnroll =
        enrollments
            .filter((e: any) => myCourseIds.has(String(e?.courseId)))
            .map((e: any) => e?.studentId)
            .filter(Boolean);

    const uniqueStudentIds = Array.from(new Set(activeStudentsFromEnroll));
    const activeStudents =
        uniqueStudentIds.length ||
        myCourses.reduce((acc: number, c: any) => acc + Number(c?.students?.length ?? 0), 0);

    // Progreso promedio por curso
    const courseWithProgress = myCourses.map((c: any, idx: number) => ({
        id: String(c?.id ?? idx),
        title: String(c?.title ?? c?.name ?? `Curso #${idx + 1}`),
        progressAvg: Number(c?.progressAvg ?? c?.avgProgress ?? 0),
        students: Number(c?.students?.length ?? 0) ||
            enrollments.filter((e: any) => String(e?.courseId) === String(c?.id)).length,
    }));

    // Tareas por revisar (si submissions tiene status "pending")
    const mySubmissions = submissions.filter(
        (s: any) => myCourseIds.has(String(s?.courseId)) && (s?.status ?? "pending") === "pending"
    );
    const assignmentsToReview = mySubmissions.length;

    // Respuestas de foro pendientes
    const forumRepliesPending =
        Array.isArray((db as any)?.forumReplies)
            ? (db as any).forumReplies.filter(
                (r: any) => myCourseIds.has(String(r?.courseId)) && (r?.status ?? "pending") === "pending"
            ).length
            : 0;

    // Entregas recientes
    const recentSubmissions = mySubmissions
        .slice(-10)
        .reverse()
        .map((s: any, i: number) => ({
            id: String(s?.id ?? i),
            student: users.find(u => u?.id === s?.studentId)?.email ?? s?.studentEmail ?? "estudiante",
            course: myCourses.find(c => String(c?.id) === String(s?.courseId))?.title ?? s?.courseId ?? "curso",
            assignment: s?.assignmentTitle ?? s?.assignmentId ?? "entrega",
            ts: s?.createdAt ?? s?.timestamp ?? new Date().toISOString(),
        }));

    return NextResponse.json({
        cards: {
            myCourses: myCourses.length,
            activeStudents: activeStudents,
            assignmentsToReview,
            forumRepliesPending,
        },
        myCourses: courseWithProgress,
        recentSubmissions,
    });
}