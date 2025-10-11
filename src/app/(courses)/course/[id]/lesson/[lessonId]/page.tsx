import { serverFetch } from "@/lib/api/server";
import type { Lesson } from "@/types";
import type { OutlineSection } from "@/components/courses/CoursePlayerLayout";
import ClientLessonPlayer from "@/components/courses/ClientLessonPlayer";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ id: string; lessonId: string }>;
}) {
    const { id, lessonId } = await params;

    // 1) Lección actual
    const lesson = await serverFetch<Lesson>(`/lessons/${lessonId}`, {
        cache: "no-store",
    });

    // 2) Outline por secciones con progreso
    const { sections } = await serverFetch<{ sections: OutlineSection[] }>(
        `/courses/${id}/outline`,
        { cache: "no-store" }
    );

    // 3) Siguiente lección lineal (flatten)
    const flat = sections.flatMap((s) => s.lessons);
    const idx = flat.findIndex((l) => l.id === lessonId);
    const next = idx >= 0 ? flat[idx + 1] : undefined;

    return (
        <div className="grid gap-4">
            <header className="grid gap-1">
                <h1 className="text-xl font-semibold">{lesson.title}</h1>
                <p className="text-sm text-fg/70">{lesson.durationMin} min</p>
            </header>

            <ClientLessonPlayer
                courseId={id}
                sectionsInitial={sections}
                currentLessonId={lessonId}
                nextLessonId={next?.id}
                videoUrl={lesson.videoUrl}
            />

            {lesson.resources?.length ? (
                <section className="rounded-2xl border border-border bg-surface">
                    <div className="border-b border-border p-4">
                        <h2 className="text-base font-semibold">Recursos</h2>
                    </div>
                    <ul className="divide-y divide-border">
                        {lesson.resources.map((r) => (
                            <li key={r.id} className="px-4 py-3">
                                <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-brand-heading hover:underline"
                                >
                                    {r.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </div>
    );
}