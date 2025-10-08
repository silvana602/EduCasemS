import { serverFetch } from "@/lib/api/server";
import type { Category } from "@/types/category";
import Link from "next/link";
import { TAGS } from "@/lib/cache/tags";

export default async function CategoriesPage() {
    const data = await serverFetch<{ items: Category[] }>(`/categories`, {
        next: { revalidate: 300, tags: [TAGS.COURSES] },
    });

    return (
        <div className="grid gap-6">
            <header>
                <h1 className="text-2xl font-semibold">Categorías</h1>
                <p className="text-sm text-fg/70">Explora todos los temas disponibles</p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 hover:bg-brand-50"
                    >
                        <div className="min-w-0">
                            <p className="font-medium">{cat.name}</p>
                            <p className="text-xs text-fg/70">{cat.count} curso(s)</p>
                        </div>
                        <span className="text-sm text-brand-800">Ver</span>
                    </Link>
                ))}
                {data.items.length === 0 && (
                    <p className="text-sm text-fg/70">Aún no hay categorías.</p>
                )}
            </div>
        </div>
    );
}