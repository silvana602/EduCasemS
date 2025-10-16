import { serverFetch } from "@/lib/api/server";
import { TAGS } from "@/lib/cache/tags";
import type { Course, Section, Lesson } from "@/types";
import type { MyCourse } from "@/types/dashboard";
import Link from "next/link";
import EnrollButton from "@/components/courses/EnrollButton";

type Data = Course & { sections: Array<Section & { lessons: Lesson[] }> };

export default async function CourseDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Datos del curso (con secciones + lecciones)
    const data = await serverFetch<Data>(`/courses/${id}`, {
        next: { revalidate: 120, tags: [TAGS.COURSE(id)] },
    });

    // Cursos del usuario para saber si está inscrito y su progreso
    const my = await serverFetch<{ items: MyCourse[] }>(`/me/courses`, {
        cache: "no-store",
    });
    const mine = my.items.find((m) => m.course.id === id);
    const isEnrolled = !!mine;

    // Primera lección del curso (por si no hay progreso aún)
    const firstLessonId = data.sections[0]?.lessons[0]?.id ?? null;

    // Siguiente lección pendiente correlativa (calculada por la API /me/courses)
    const nextLessonId = mine?.nextLessonId ?? null;

    // Href del CTA: si hay progreso, continuar; si no, empezar en la primera
    const continueHref =
        nextLessonId
            ? `/course/${id}/lesson/${nextLessonId}`
            : firstLessonId
                ? `/course/${id}/lesson/${firstLessonId}`
                : null;

    const ctaLabel = mine && mine.progressPct > 0 ? "Continuar" : "Empezar";

    return (
        <div className="grid gap-6">
            <header className="grid gap-2">
                <h1 className="text-2xl font-semibold">{data.title}</h1>
                <p className="text-sm text-fg/70">{data.description}</p>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-heading">
                        {data.category}
                    </span>
                    <span className="capitalize text-fg/70">{data.level}</span>

                    <div className="ml-auto flex gap-2">
                        {isEnrolled ? (
                            continueHref && (
                                <Link
                                    href={continueHref}
                                    className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-800"
                                >
                                    {ctaLabel}
                                </Link>
                            )
                        ) : (
                            <EnrollButton courseId={id} />
                        )}
                    </div>
                </div>
            </header>

            {/* Secciones + Lecciones */}
            <section className="rounded-2xl border border-border bg-surface">
                <div className="border-b border-border p-4">
                    <h2 className="text-base font-semibold">Contenido del curso</h2>
                </div>

                {data.sections.map((sec) => (
                    <div key={sec.id} className="divide-y divide-border">
                        <div className="px-4 py-3 font-medium">
                            {sec.order}. {sec.title}
                        </div>
                        <ul>
                            {sec.lessons.map((l) => (
                                <li
                                    key={l.id}
                                    className="flex items-center justify-between px-6 py-3"
                                >
                                    <div className="min-w-0">
                                        <Link
                                            href={`/course/${data.id}/lesson/${l.id}`}
                                            className="hover:underline"
                                        >
                                            {sec.order}.{l.order} {l.title}
                                        </Link>
                                    </div>
                                    <span className="shrink-0 text-xs text-fg/70">
                                        {l.durationMin} min
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </div>
    );
}