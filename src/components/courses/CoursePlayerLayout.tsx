"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import cn from "@/utils/cn";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";

export interface OutlineLesson {
    id: string;
    title: string;
    order: number;
    durationMin: number;
    completed?: boolean;
}
export interface OutlineSection {
    id: string;
    title: string;
    order: number;
    lessons: OutlineLesson[];
}

function useLocalJson<T>(key: string, initial: T) {
    const [val, setVal] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : initial;
        } catch {
            return initial;
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch { }
    }, [key, val]);
    return [val, setVal] as const;
}

export default function CoursePlayerLayout({
    courseId,
    currentLessonId,
    sections,
    onOptimisticToggle,
    children,
}: {
    courseId: string;
    currentLessonId: string;
    sections: OutlineSection[];
    onOptimisticToggle?: (lessonId: string, completed: boolean) => void;
    children: React.ReactNode;
}) {
    const router = useRouter();

    // Visibilidad del contenido en móviles (debajo del video)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Estado de colapso de cada sección (persistente)
    const [collapsed, setCollapsed] = useLocalJson<Record<string, boolean>>(
        `player:collapsed:${courseId}`,
        {}
    );

    function toggleSection(id: string) {
        setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    const { flat, idx, nextId } = useMemo(() => {
        const flat = sections.flatMap((s) => s.lessons);
        const idx = flat.findIndex((l) => l.id === currentLessonId);
        const nextId = idx >= 0 ? flat[idx + 1]?.id : undefined;
        return { flat, idx, nextId };
    }, [sections, currentLessonId]);

    function goTo(lessonId: string) {
        router.push(`/course/${courseId}/lesson/${lessonId}`);
    }

    // Ayuda con '?'
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.key === "?" && !e.shiftKey) || (e.key === "/" && e.shiftKey)) {
                e.preventDefault();
                alert("Atajos: J (-10s), K o Espacio (play/pausa), L (+10s), F (pantalla completa)");
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        // Dos columnas desde lg (≥1024px). En small/medium se apila.
        <div className="grid gap-4 lg:grid-cols-[minmax(0,_1fr)_340px]">
            {/* Columna izquierda: video + acciones */}
            <section className="grid gap-3">
                {/* Controles de móvil: mostrar/ocultar contenido + siguiente */}
                <div className="flex items-center justify-between lg:hidden">
                    <button
                        className="rounded-md border border-border px-3 py-1 text-xs"
                        onClick={() => setSidebarOpen((v) => !v)}
                        aria-expanded={sidebarOpen}
                        aria-controls="course-content"
                    >
                        {sidebarOpen ? "Ocultar contenido" : "Mostrar contenido"}
                    </button>
                    {nextId && (
                        <button
                            onClick={() => goTo(nextId)}
                            className="rounded-md bg-brand-600 px-3 py-1 text-xs text-white hover:bg-brand-800"
                        >
                            Siguiente
                        </button>
                    )}
                </div>

                {children}

                {/* Botón 'Siguiente' fijo en desktop */}
                {nextId && (
                    <div className="sticky bottom-3 hidden justify-end lg:flex">
                        <button
                            onClick={() => goTo(nextId)}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white shadow hover:bg-brand-800"
                        >
                            Siguiente lección →
                        </button>
                    </div>
                )}
            </section>

            {/* Columna derecha (sidebar). En móvil se muestra debajo del video, colapsable */}
            <aside
                id="course-content"
                className={cn(
                    "rounded-2xl border border-border bg-surface p-3",
                    "lg:sticky lg:top-4 lg:h-fit lg:block",
                    // comportamiento en small/medium
                    sidebarOpen ? "block" : "hidden lg:block"
                )}
            >
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Contenido del curso</h2>
                    {/* Cerrar solo visible en móvil */}
                    <button
                        className="rounded-md px-2 py-1 text-xs hover:bg-brand-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Cerrar
                    </button>
                </div>

                <ul className="space-y-2">
                    {sections.map((sec) => {
                        const total = sec.lessons.length || 1;
                        const done = sec.lessons.filter((l) => l.completed).length;
                        const pct = Math.round((done / total) * 100);
                        const isCollapsed = !!collapsed[sec.id];

                        return (
                            <li key={sec.id} className="rounded-lg border border-border">
                                <button
                                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                                    onClick={() => toggleSection(sec.id)}
                                    aria-expanded={!isCollapsed}
                                >
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium">
                                            {sec.order}. {sec.title}
                                        </div>
                                        <div className="text-[10px] text-fg/60">
                                            {done}/{total} • {pct}%
                                        </div>
                                    </div>
                                    <span className="text-xs text-fg/60">{isCollapsed ? <FaCaretRight /> : <FaCaretDown />}</span>
                                </button>

                                {!isCollapsed && (
                                    <ul className="border-t border-border">
                                        {sec.lessons.map((l) => {
                                            const active = l.id === currentLessonId;
                                            return (
                                                <li key={l.id}>
                                                    <button
                                                        onClick={() => goTo(l.id)}
                                                        aria-current={active ? "page" : undefined}
                                                        className={cn(
                                                            "w-full px-3 py-2 text-left text-sm hover:bg-brand-50",
                                                            active ? "bg-brand-50 ring-1 ring-brand-600" : ""
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-6 shrink-0 text-xs text-fg/60">
                                                                {sec.order}.{l.order}
                                                            </span>
                                                            <span className="min-w-0 flex-1 truncate">{l.title}</span>
                                                            {l.completed && (
                                                                <span className="shrink-0 rounded-full bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-heading">
                                                                    Hecha
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="ml-6 text-[10px] text-fg/60">{l.durationMin} min</div>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </div>
    );
}