import type { Course, Lesson, MockUser, Section, User } from "@/types";
import { uid } from "./utils";

const G = globalThis as any;

if (!G.__EDU_DB__) {
    G.__EDU_DB__ = {
        users: [] as User[],
        courses: [] as Course[],
        sections: [] as Section[],
        lessons: [] as Lesson[],
        progress: new Map<string, Set<string>>(),
        enrollments: [] as Array<{ userId: string; courseId: string; lastLessonId?: string }>,
    };
}

export const db = G.__EDU_DB__ as {
    users: User[];
    courses: Course[];
    sections: Section[];
    lessons: Lesson[];
    progress: Map<string, Set<string>>;
    enrollments: Array<{ userId: string; courseId: string; lastLessonId?: string }>;
};

export function seedOnce() {
    const G = globalThis as any;
    if (G.__EDU_MOCKS_SEEDED__) return;
    G.__EDU_MOCKS_SEEDED__ = true; // 👈 set al inicio

    // Users
    const u1: MockUser = { id: uid("usr"), name: "Ana Torres", email: "ana@demo.com", role: "student", password: "123456" };
    const u2: MockUser = { id: uid("usr"), name: "Luis Pérez", email: "luis@demo.com", role: "instructor", password: "123456" };
    const admin: MockUser = { id: uid("usr"), name: "Admin", email: "admin@demo.com", role: "admin", password: "admin" };
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

    // Videos demo
    const demoVideos = [
        "/videos/demo1.mp4",
        "/videos/demo2.mp4",
        "/videos/demo3.mp4",
        "/videos/demo4.mp4",
        "/videos/demo5.mp4",
    ];

    // Helpers
    function makeSection(courseId: string, title: string, order: number): Section {
        const s: Section = { id: uid("sec"), courseId, title, order };
        db.sections.push(s);
        return s;
    }
    function makeLessons(courseId: string, section: Section, titles: string[]) {
        titles.forEach((t, i) => {
            db.lessons.push({
                id: uid("les"),
                courseId,
                sectionId: section.id,
                title: t,
                durationMin: 8 + i * 3,
                order: i + 1,
                resources: [
                    { id: uid("res"), name: "Apuntes PDF", url: "/files/sample.pdf" },
                    { id: uid("res"), name: "Código fuente", url: "https://github.com/educasem/demo" },
                ],
                videoUrl: demoVideos[(section.order + i) % demoVideos.length],
            });
        });
    }

    // Secciones + lecciones
    const s1_1 = makeSection(c1.id, "Fundamentos de Next.js", 1);
    makeLessons(c1.id, s1_1, ["Qué es Next.js", "App Router", "SSR/ISR"]);
    const s1_2 = makeSection(c1.id, "Data Fetching y Deploy", 2);
    makeLessons(c1.id, s1_2, ["Data Fetching", "Deploy en Vercel"]);

    const s2_1 = makeSection(c2.id, "Bases de TypeScript", 1);
    makeLessons(c2.id, s2_1, ["Tipos básicos", "Interfaces y tipos", "Genéricos"]);
    const s2_2 = makeSection(c2.id, "Tipos avanzados", 2);
    makeLessons(c2.id, s2_2, ["Narrowing", "Utilitarios"]);

    const s3_1 = makeSection(c3.id, "React Avanzado", 1);
    makeLessons(c3.id, s3_1, ["React Server Components", "Performance"]);
    const s3_2 = makeSection(c3.id, "Calidad", 2);
    makeLessons(c3.id, s3_2, ["Testing", "Accesibilidad"]);

    // progreso inicial
    db.progress.set(u1.id, new Set());

    // inscripciones (Ana en 2 cursos)
    const firstC1 = db.lessons.filter(l => l.courseId === c1.id).sort((a, b) => a.order - b.order)[0];
    const firstC2 = db.lessons.filter(l => l.courseId === c2.id).sort((a, b) => a.order - b.order)[0];
    db.enrollments.push(
        { userId: u1.id, courseId: c1.id, lastLessonId: firstC1?.id },
        { userId: u1.id, courseId: c2.id, lastLessonId: firstC2?.id }
    );
}