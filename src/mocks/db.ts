import type { Course, Lesson, User } from "./types";
import { uid } from "./utils";

const G = globalThis as any;

if (!G.__EDU_DB__) {
    G.__EDU_DB__ = {
        users: [] as User[],
        courses: [] as Course[],
        lessons: [] as Lesson[],
        progress: new Map<string, Set<string>>(), // userId -> completed lessonIds
        enrollments: [] as Array<{ userId: string; courseId: string; lastLessonId?: string }>,
    };
}
export const db = G.__EDU_DB__ as {
    users: User[];
    courses: Course[];
    lessons: Lesson[];
    progress: Map<string, Set<string>>;
    enrollments: Array<{ userId: string; courseId: string; lastLessonId?: string }>;
};

export function seedOnce() {
    if (G.__EDU_MOCKS_SEEDED__) return;

    // Users
    const u1: User = { id: uid("usr"), name: "Ana Torres", email: "ana@demo.com", role: "student", password: "123456" };
    const u2: User = { id: uid("usr"), name: "Luis Pérez", email: "luis@demo.com", role: "instructor", password: "123456" };
    const admin: User = { id: uid("usr"), name: "Admin", email: "admin@demo.com", role: "admin", password: "admin" };
    db.users.push(u1, u2, admin);

    // Courses
    const c1: Course = {
        id: uid("crs"),
        title: "Introducción a Next.js",
        description: "Crea aplicaciones modernas con App Router, SSR e ISR.",
        category: "Web",
        level: "beginner",
        price: 0,
        thumbnailUrl: "/images/next-thumb.jpg",
        instructorId: u2.id,
    };
    const c2: Course = {
        id: uid("crs"),
        title: "TypeScript desde cero",
        description: "Tipado estático para JS: interfaces, genéricos y más.",
        category: "Programación",
        level: "beginner",
        price: 19,
        thumbnailUrl: "/images/ts-thumb.jpg",
        instructorId: u2.id,
    };
    const c3: Course = {
        id: uid("crs"),
        title: "Frontend Avanzado con React 19",
        description: "Patrones, rendimiento y testing para proyectos reales.",
        category: "Web",
        level: "advanced",
        price: 29,
        thumbnailUrl: "/images/react-thumb.jpg",
        instructorId: u2.id,
    };
    db.courses.push(c1, c2, c3);

    // Lessons por curso
    function makeLessons(courseId: string, titles: string[]) {
        return titles.map((t, i) => ({
            id: uid("les"),
            courseId,
            title: t,
            durationMin: 8 + i * 3,
            order: i + 1,
            resources: [
                { id: uid("res"), name: "Apuntes PDF", url: "/files/sample.pdf" },
                { id: uid("res"), name: "Código fuente", url: "https://github.com/educasem/demo" },
            ],
        }));
    }

    const l1 = makeLessons(c1.id, ["Qué es Next.js", "App Router", "SSR/ISR", "Data Fetching", "Deploy en Vercel"]);
    const l2 = makeLessons(c2.id, ["Tipos básicos", "Interfaces y tipos", "Genéricos", "Narrowing", "Utilitarios"]);
    const l3 = makeLessons(c3.id, ["React Server Components", "Performance", "Testing", "Accesibilidad"]);
    db.lessons.push(...l1, ...l2, ...l3);

    // progreso inicial
    db.progress.set(u1.id, new Set());

    // inscribir a Ana
    db.enrollments.push(
        { userId: u1.id, courseId: c1.id, lastLessonId: l1[0].id },
        { userId: u1.id, courseId: c2.id, lastLessonId: l2[0].id }
    );

    G.__EDU_MOCKS_SEEDED__ = true;
}