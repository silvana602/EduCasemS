import { serverFetch } from "@/lib/api/server";
import { TAGS } from "@/lib/cache/tags";
import type { Course, Lesson } from "@/types/course";
import type { MyCourse } from "@/types/dashboard";
import Link from "next/link";
import EnrollButton from "@/components/courses/EnrollButton";

type Data = Course & { lessons: Lesson[] };

export default async function CourseDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Datos del curso (cache suave)
    const data = await serverFetch<Data>(`/courses/${id}`, {
        next: { revalidate: 120, tags: [TAGS.COURSE(id)] },
    });

    // Cursos del usuario (user-specific)
    const my = await serverFetch<{ items: MyCourse[] }>(`/me/courses`, {
        cache: "no-store",
    });

    const isEnrolled = my.items.some((m) => m.course.id === id);
    const firstLessonId = data.lessons[0]?.id;

    return (
        <div className="grid gap-6">
            <header className="grid gap-2">
                <h1 className="text-2xl font-semibold">{data.title}</h1>
                <p className="text-sm text-fg/70">{data.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-800">{data.category}</span>
                    <span className="capitalize text-fg/70">{data.level}</span>

                    <div className="ml-auto flex gap-2">
                        {isEnrolled ? (
                            <>
                                {firstLessonId && (
                                    <Link
                                        href={`/course/${id}/lesson/${firstLessonId}`}
                                        className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-800"
                                    >
                                        Empezar
                                    </Link>
                                )}
                                {/* podrías añadir un botón “Continuar” si calculas la nextLesson del usuario */}
                            </>
                        ) : (
                            <EnrollButton courseId={id} />
                        )}
                    </div>
                </div>
            </header>

            <section className="rounded-2xl border border-border bg-surface">
                <div className="border-b border-border p-4">
                    <h2 className="text-base font-semibold">Contenido del curso</h2>
                </div>
                <ul className="divide-y divide-border">
                    {data.lessons.map((l) => (
                        <li key={l.id} className="flex items-center justify-between px-4 py-3">
                            <div className="min-w-0">
                                <Link href={`/course/${data.id}/lesson/${l.id}`} className="hover:underline">
                                    {l.order}. {l.title}
                                </Link>
                            </div>
                            <span className="shrink-0 text-xs text-fg/70">{l.durationMin} min</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}