import { serverFetch } from "@/lib/api/server";
import { TAGS } from "@/lib/cache/tags";
import type { Course, Lesson } from "@/types/course";
import Link from "next/link";

type Data = Course & { lessons: Lesson[] };

export default async function CourseDetail({ params }: { params: { id: string } }) {
    const data = await serverFetch<Data>(`/courses/${params.id}`, {
        next: { revalidate: 120, tags: [TAGS.COURSE(params.id)] },
    });

    return (
        <div className="grid gap-6">
            <header className="grid gap-2">
                <h1 className="text-2xl font-semibold">{data.title}</h1>
                <p className="text-sm text-fg/70">{data.description}</p>
                <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-800">{data.category}</span>
                    <span className="capitalize text-fg/70">{data.level}</span>
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