// src/mocks/db.ts
import type { Course, Lesson, MockUser, Order, Section, User } from "@/types";
import { uid } from "./utils";

type Store = {
    users: User[];
    courses: Course[];
    sections: Section[];
    lessons: Lesson[];
    progress: Map<string, Set<string>>;
    enrollments: Array<{ userId: string; courseId: string; lastLessonId?: string }>;
    passwords: Map<string, string>;
    orders: Order[];   // ✅ NUEVO
};

const G = globalThis as any;

// Asegura el shape del store global
function initDb(): Store {
    if (!G.__EDU_DB__) {
        G.__EDU_DB__ = {
            users: [],
            courses: [],
            sections: [],
            lessons: [],
            progress: new Map<string, Set<string>>(),
            enrollments: [],
            passwords: new Map<string, string>(),
            orders: [], // ✅ NUEVO
        } satisfies Store;
    } else {
        // Si faltan estructuras (por resets antiguos), créalas
        if (!G.__EDU_DB__.progress) G.__EDU_DB__.progress = new Map<string, Set<string>>();
        if (!G.__EDU_DB__.passwords) G.__EDU_DB__.passwords = new Map<string, string>();
        if (!G.__EDU_DB__.users) G.__EDU_DB__.users = [];
        if (!G.__EDU_DB__.courses) G.__EDU_DB__.courses = [];
        if (!G.__EDU_DB__.sections) G.__EDU_DB__.sections = [];
        if (!G.__EDU_DB__.lessons) G.__EDU_DB__.lessons = [];
        if (!G.__EDU_DB__.enrollments) G.__EDU_DB__.enrollments = [];
        if (!G.__EDU_DB__.orders) G.__EDU_DB__.orders = []; // ✅ NUEVO
    }
    return G.__EDU_DB__ as Store;
}

export const db: Store = initDb();

export function getUserById(id: string) {
    return db.users.find(u => u.id === id) ?? null;
}
export function getUserByEmail(email: string) {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}
export function updateUserProfile(id: string, patch: Partial<Pick<User, "name" | "avatarUrl">>) {
    const u = getUserById(id);
    if (!u) return null;
    if (typeof patch.name === "string") u.name = patch.name;
    if ("avatarUrl" in patch) (u as User).avatarUrl = patch.avatarUrl ?? null;
    return u;
}

// 🔁 Reset fuerte del contenido (conserva referencias de Map/Arrays si quieres)
export function hardResetDb() {
    initDb(); // asegura shape
    db.users.length = 0;
    db.courses.length = 0;
    db.sections.length = 0;
    db.lessons.length = 0;
    db.enrollments.length = 0;
    db.orders.length = 0; // ✅ NUEVO
    db.progress.clear();
    db.passwords.clear();
    // también baja el flag de seed
    G.__EDU_MOCKS_SEEDED__ = false;
}

export function seedOnce() {
    initDb(); // asegura shape ANTES de popular
    if (G.__EDU_MOCKS_SEEDED__) return;
    G.__EDU_MOCKS_SEEDED__ = true;

    // ---------- Users ----------
    const u1: MockUser = {
        id: uid("usr"),
        name: "Ana Torres",
        email: "ana@demo.com",
        role: "student",
        password: "123456",
        avatarUrl: null,
        isActive: true,
    };
    const u2: MockUser = {
        id: uid("usr"),
        name: "Luis Pérez",
        email: "luis@demo.com",
        role: "instructor",
        password: "123456",
        avatarUrl: null,
        isActive: true,
    };
    const admin: MockUser = {
        id: uid("usr"),
        name: "Admin",
        email: "admin@demo.com",
        role: "admin",
        password: "admin",
        avatarUrl: null,
        isActive: true,
    };

    [u1, u2, admin].forEach(mu => {
        const { password, ...user } = mu;
        db.users.push(user);
        db.passwords.set(user.id, password);   // ✅ ya existe siempre
    });

    // ---------- Courses ----------
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

    const demoVideos = ["/videos/demo1.mp4", "/videos/demo2.mp4", "/videos/demo3.mp4", "/videos/demo4.mp4", "/videos/demo5.mp4"];

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

    // Amplíado
    const c1_s1 = makeSection(c1.id, "Fundamentos de Next.js", 1);
    makeLessons(c1.id, c1_s1, ["Qué es Next.js", "App Router", "SSR/ISR", "Layouts y Routing"]);
    const c1_s2 = makeSection(c1.id, "Data Fetching y Deploy", 2);
    makeLessons(c1.id, c1_s2, ["Data Fetching (RSC)", "Forms y acciones", "Deploy en Vercel"]);
    const c1_s3 = makeSection(c1.id, "Optimización y buenas prácticas", 3);
    makeLessons(c1.id, c1_s3, ["Imágenes y fuentes", "Cache y revalidación", "Accesibilidad"]);

    const c2_s1 = makeSection(c2.id, "Bases de TypeScript", 1);
    makeLessons(c2.id, c2_s1, ["Tipos básicos", "Interfaces y tipos", "Genéricos"]);
    const c2_s2 = makeSection(c2.id, "Tipos avanzados", 2);
    makeLessons(c2.id, c2_s2, ["Narrowing", "Utilitarios", "Inferencia avanzada"]);
    const c2_s3 = makeSection(c2.id, "TS en proyectos reales", 3);
    makeLessons(c2.id, c2_s3, ["TS + React", "TSConfig y paths", "Mejores prácticas"]);

    const c3_s1 = makeSection(c3.id, "React Avanzado", 1);
    makeLessons(c3.id, c3_s1, ["React Server Components", "Concurrent features", "Performance"]);
    const c3_s2 = makeSection(c3.id, "Calidad", 2);
    makeLessons(c3.id, c3_s2, ["Testing", "Accesibilidad", "Storybook"]);
    const c3_s3 = makeSection(c3.id, "Arquitectura escalable", 3);
    makeLessons(c3.id, c3_s3, ["Patrones de estado", "Módulos y límites", "Monorepos"]);

    // ---------- Progreso + Enrollments ----------
    db.progress.set(u1.id, new Set());

    const firstC1 = db.lessons.filter(l => l.courseId === c1.id).sort((a, b) => a.order - b.order)[0];
    const firstC2 = db.lessons.filter(l => l.courseId === c2.id).sort((a, b) => a.order - b.order)[0];
    db.enrollments.push(
        { userId: u1.id, courseId: c1.id, lastLessonId: firstC1?.id },
        { userId: u1.id, courseId: c2.id, lastLessonId: firstC2?.id }
    );

    // ---------- Orders (para /admin/orders) ----------
    // Generamos ejemplos con varios estados y fechas
    const now = Date.now();
    const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

    db.orders.push(
        {
            id: uid("ord"),
            studentId: u1.id,
            amountBOB: 19,
            status: "paid",
            createdAt: daysAgo(1),
        },
        {
            id: uid("ord"),
            studentId: u1.id,
            amountBOB: 29,
            status: "pending",
            createdAt: daysAgo(3),
        },
        {
            id: uid("ord"),
            studentId: u1.id,
            amountBOB: 19,
            status: "refunded",
            createdAt: daysAgo(10),
        },
        {
            id: uid("ord"),
            studentId: u1.id,
            amountBOB: 29,
            status: "canceled",
            createdAt: daysAgo(20),
        }
    );
}