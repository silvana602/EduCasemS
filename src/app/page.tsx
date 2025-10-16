import { serverFetch } from "@/lib/api/server";
import { TAGS } from "@/lib/cache/tags";
import type { Course } from "@/types/course";
import type { Category } from "@/types/category";
import Link from "next/link";
import Image from "next/image";
import CourseCard from "@/components/courses/CourseCard";

export default async function HomePage() {
    // Top 6 cursos (primer página)
    const courses = await serverFetch<{ items: Course[] }>(`/courses?page=1&pageSize=6`, {
        next: { revalidate: 120, tags: [TAGS.COURSES] },
    });

    const categories = await serverFetch<{ items: Category[] }>(`/categories`, {
        next: { revalidate: 300, tags: [TAGS.COURSES] },
    });

    return (
        <div className="grid gap-10">
            {/* Hero */}
            <section className="rounded-2xl border border-border bg-surface p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                    <h1 className="text-3xl font-bold leading-tight">
                        Aprende con cursos modernos de <span className="text-brand-heading">Educasem</span>
                    </h1>
                    <p className="mt-2 text-fg/70">
                        Catálogo curado de tecnología y habilidades digitales. Empieza gratis hoy.
                    </p>
                    <div className="mt-4 flex gap-2">
                        <Link href="/courses" className="rounded-xl bg-brand-600 px-4 py-2 text-white hover:bg-brand-800 text-sm">
                            Ver cursos
                        </Link>
                        <Link href="/register" className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-brand-50">
                            Crear cuenta
                        </Link>
                    </div>
                </div>
                <div className="relative order-1 md:order-2 aspect-video w-full rounded-xl overflow-hidden">
                    <Image src="/images/react-thumb.jpg" alt="Cursos" fill className="object-cover" priority />
                </div>
            </section>

            {/* Categorías destacadas */}
            <section className="grid gap-4">
                <header className="flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Categorías</h2>
                        <p className="text-sm text-fg/70">Explora por temas</p>
                    </div>
                    <Link href="/categories" className="text-sm text-brand-heading hover:underline">
                        Ver todas →
                    </Link>
                </header>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.items.slice(0, 6).map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/categories/${cat.slug}`}
                            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 hover:bg-brand-50"
                        >
                            <div className="min-w-0">
                                <p className="font-medium">{cat.name}</p>
                                <p className="text-xs text-fg/70">{cat.count} curso(s)</p>
                            </div>
                            <span className="text-sm text-brand-heading">Ver</span>
                        </Link>
                    ))}
                    {categories.items.length === 0 && (
                        <p className="text-sm text-fg/70">Aún no hay categorías.</p>
                    )}
                </div>
            </section>

            {/* Cursos destacados */}
            <section className="grid gap-4">
                <header>
                    <h2 className="text-xl font-semibold">Cursos destacados</h2>
                    <p className="text-sm text-fg/70">Una selección para comenzar</p>
                </header>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.items.map((c) => (
                        <CourseCard key={c.id} course={c} />
                    ))}
                    {courses.items.length === 0 && (
                        <p className="text-sm text-fg/70">No hay cursos disponibles.</p>
                    )}
                </div>
            </section>
        </div>
    );
}