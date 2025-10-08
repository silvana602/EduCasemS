import { serverFetch } from "@/lib/api/server";
import { TAGS } from "@/lib/cache/tags";
import type { Lesson } from "@/types/course";
import VideoPlayer from "@/components/courses/VideoPlayer";
import Link from "next/link";

export default async function LessonPage({ params }: { params: { id: string; lessonId: string } }) {
    const lesson = await serverFetch<Lesson>(`/courses/${params.id}/lessons/${params.lessonId}`, {
        // Metadatos de la lección cambian poco → cache suave
        next: { revalidate: 300, tags: [TAGS.LESSON(params.lessonId)] },
    });

    return (
        <div className="grid gap-6">
            <nav className="text-sm">
                <Link href={`/course/${params.id}`} className="text-brand-800 hover:underline">← Volver al curso</Link>
            </nav>

            <header className="grid gap-1">
                <h1 className="text-xl font-semibold">{lesson.title}</h1>
                <p className="text-sm text-fg/70">{lesson.durationMin} min</p>
            </header>

            <section className="rounded-2xl border border-border bg-surface p-3">
                <VideoPlayer lessonId={lesson.id} />
            </section>

            {lesson.resources?.length ? (
                <section className="rounded-2xl border border-border bg-surface">
                    <div className="border-b border-border p-4">
                        <h2 className="text-base font-semibold">Recursos</h2>
                    </div>
                    <ul className="divide-y divide-border">
                        {lesson.resources.map((r) => (
                            <li key={r.id} className="px-4 py-3">
                                <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-brand-800 hover:underline">
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