import { serverFetch } from "@/lib/api/server";
import { TAGS } from "@/lib/cache/tags";
import type { Course } from "@/types/course";
import CoursesFilters from "@/components/courses/CoursesFilters";
import CourseCard from "@/components/courses/CourseCard";
import Link from "next/link";

const PAGE_SIZE = 12;

type SP = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined, dft = "") =>
    Array.isArray(v) ? (v[0] ?? dft) : (v ?? dft);

export default async function CoursesPage({
    searchParams,
}: {
    searchParams: Promise<SP>;
}) {
    const sp = await searchParams;                 // ⬅️ importante
    const q = str(sp.q, "");
    const page = Math.max(1, Number(str(sp.page, "1")));

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));

    const data = await serverFetch<{
        items: Course[];
        total: number;
        page: number;
        pageSize: number;
    }>(`/courses?${params.toString()}`, {
        next: { revalidate: 120, tags: [TAGS.COURSES] },
    });

    const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

    return (
        <div className="grid gap-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Cursos</h1>
                    <p className="text-sm text-fg/70">Explora el catálogo</p>
                </div>
                <CoursesFilters initialQuery={q} />
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((c) => (
                    <CourseCard key={c.id} course={c} />
                ))}
                {data.items.length === 0 && (
                    <p className="text-sm text-fg/70">No encontramos cursos para tu búsqueda.</p>
                )}
            </section>

            {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2">
                    <PageLink page={page - 1} disabled={page <= 1} q={q}>Anterior</PageLink>
                    <span className="text-sm text-fg/70">Página {page} de {totalPages}</span>
                    <PageLink page={page + 1} disabled={page >= totalPages} q={q}>Siguiente</PageLink>
                </nav>
            )}
        </div>
    );
}

function PageLink({
    page,
    q,
    disabled,
    children,
}: {
    page: number;
    q: string;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    p.set("page", String(Math.max(1, page)));

    if (disabled) {
        return (
            <span className="rounded-xl border border-border px-3 py-1.5 text-sm text-fg/50">
                {children}
            </span>
        );
    }

    return (
        <Link
            className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm hover:bg-brand-50"
            href={`/courses?${p.toString()}`}
        >
            {children}
        </Link>
    );
}