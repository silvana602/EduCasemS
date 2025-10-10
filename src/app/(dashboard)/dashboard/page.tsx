import { serverFetch } from "@/lib/api/server";
import type { MyCourse } from "@/types/dashboard";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const data = await serverFetch<{ items: MyCourse[] }>("/me/courses", {
        cache: "no-store",
    });

    const items = data.items;
    const continueList = items
        .filter((i) => i.progressPct > 0 && i.nextLessonId)
        .slice(0, 3);

    return (
        <div className="grid gap-8">
            <header className="grid gap-1">
                <h1 className="text-2xl font-semibold">Tu panel</h1>
                <p className="text-sm text-fg/70">
                    Continúa donde lo dejaste y revisa tus cursos.
                </p>
            </header>

            {/* Continuar aprendiendo */}
            <section className="grid gap-3">
                <h2 className="text-base font-semibold">Continuar aprendiendo</h2>
                {continueList.length === 0 ? (
                    <p className="text-sm text-fg/70">
                        Aún no tienes lecciones en progreso.
                    </p>
                ) : (
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {continueList.map((mc) => {
                            const href = mc.nextLessonId
                                ? `/course/${mc.course.id}/lesson/${mc.nextLessonId}`
                                : `/course/${mc.course.id}`;
                            return (
                                <li
                                    key={mc.course.id}
                                    className="rounded-2xl border border-border bg-surface p-3"
                                >
                                    <div className="flex gap-3">
                                        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                                            <Image
                                                src={mc.course.thumbnailUrl}
                                                alt={mc.course.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <Link
                                                href={`/course/${mc.course.id}`}
                                                className="font-medium hover:underline line-clamp-2"
                                            >
                                                {mc.course.title}
                                            </Link>
                                            <ProgressBar value={mc.progressPct} className="mt-2" />
                                            <div className="mt-2">
                                                <Link
                                                    href={href}
                                                    className="rounded-md bg-brand-600 px-3 py-1 text-xs text-white hover:bg-brand-800"
                                                >
                                                    Continuar
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            {/* Mis cursos */}
            <section className="grid gap-3">
                <h2 className="text-base font-semibold">Mis cursos</h2>
                {items.length === 0 ? (
                    <p className="text-sm text-fg/70">Aún no estás inscrito en cursos.</p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((mc) => {
                            const hasProgress = mc.progressPct > 0;

                            const startHref = mc.firstLessonId
                                ? `/course/${mc.course.id}/lesson/${mc.firstLessonId}`
                                : `/course/${mc.course.id}`;

                            const continueHref = mc.nextLessonId
                                ? `/course/${mc.course.id}/lesson/${mc.nextLessonId}`
                                : `/course/${mc.course.id}`;

                            return (
                                <li
                                    key={mc.course.id}
                                    className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                                >
                                    <Link href={`/course/${mc.course.id}`} className="block">
                                        <div className="relative aspect-video w-full">
                                            <Image
                                                src={mc.course.thumbnailUrl}
                                                alt={mc.course.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link
                                            href={`/course/${mc.course.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {mc.course.title}
                                        </Link>
                                        <p className="mt-1 text-xs text-fg/70">
                                            {mc.completed}/{mc.total} lección(es)
                                        </p>
                                        <ProgressBar value={mc.progressPct} className="mt-2" />

                                        <div className="mt-3 flex gap-2">
                                            {/* Empezar o Continuar */}
                                            {!hasProgress ? (
                                                <Link
                                                    href={startHref}
                                                    className="rounded-md border border-border px-3 py-1 text-xs hover:bg-brand-50"
                                                >
                                                    Empezar
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={continueHref}
                                                    className="rounded-md bg-brand-600 px-3 py-1 text-xs text-white hover:bg-brand-800"
                                                >
                                                    Continuar
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </div>
    );
}

function ProgressBar({
    value,
    className,
}: {
    value: number;
    className?: string;
}) {
    return (
        <div
            className={["h-2 w-full overflow-hidden rounded-full bg-border", className]
                .filter(Boolean)
                .join(" ")}
        >
            <div
                className="h-full bg-brand-600"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                role="progressbar"
            />
        </div>
    );
}