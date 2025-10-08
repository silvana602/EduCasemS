import { serverFetch } from "@/lib/api/server";
import { TAGS } from "@/lib/cache/tags";
import type { Course } from "@/types/course";
import type { Category } from "@/types/category";
import CourseCard from "@/components/courses/CourseCard";
import Link from "next/link";

const PAGE_SIZE = 12;

type SP = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined, dft = "") =>
    Array.isArray(v) ? (v[0] ?? dft) : (v ?? dft);

export default async function CategoryListing({
    params,
    searchParams,
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<SP>;
}) {
    // 👇 await de ambos props
    const [{ category: slug }, sp] = await Promise.all([params, searchParams]);
    const page = Math.max(1, Number(str(sp.page, "1")));

    // Encabezado (nombre + conteo)
    const catData = await serverFetch<{ items: Category[] }>(`/categories`, {
        next: { revalidate: 300, tags: [TAGS.COURSES] },
    });
    const current = catData.items.find((c) => c.slug === slug);

    const qp = new URLSearchParams();
    qp.set("page", String(page));
    qp.set("pageSize", String(PAGE_SIZE));
    qp.set("category", slug);

    const data = await serverFetch<{ items: Course[]; total: number }>(
        `/courses?${qp.toString()}`,
        { next: { revalidate: 120, tags: [TAGS.COURSES] } }
    );

    const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

    return (
        <div className="grid gap-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {current ? current.name : "Categoría"}
                    </h1>
                    <p className="text-sm text-fg/70">
                        {current ? `${current.count} curso(s)` : "Lista de cursos por categoría"}
                    </p>
                </div>
                <Link href="/categories" className="text-sm text-brand-800 hover:underline">
                    ← Todas las categorías
                </Link>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((c) => (
                    <CourseCard key={c.id} course={c} />
                ))}
                {data.items.length === 0 && (
                    <p className="text-sm text-fg/70">No hay cursos en esta categoría.</p>
                )}
            </section>

            {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2">
                    <PageLink slug={slug} page={page - 1} disabled={page <= 1}>
                        Anterior
                    </PageLink>
                    <span className="text-sm text-fg/70">
                        Página {page} de {totalPages}
                    </span>
                    <PageLink slug={slug} page={page + 1} disabled={page >= totalPages}>
                        Siguiente
                    </PageLink>
                </nav>
            )}
        </div>
    );
}

function PageLink({
    slug,
    page,
    disabled,
    children,
}: {
    slug: string;
    page: number;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    const p = new URLSearchParams();
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
            href={`/categories/${slug}?${p.toString()}`}
        >
            {children}
        </Link>
    );
}