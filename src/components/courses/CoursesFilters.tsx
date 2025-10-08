"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CoursesFilters({ initialQuery }: { initialQuery: string }) {
    const [q, setQ] = useState(initialQuery);
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    // Debounce simple
    useEffect(() => {
        const h = setTimeout(() => {
            const next = new URLSearchParams(params.toString());
            if (q) next.set("q", q);
            else next.delete("q");
            next.delete("page"); // reset page al cambiar búsqueda
            router.replace(`${pathname}?${next.toString()}`, { scroll: false });
        }, 350);
        return () => clearTimeout(h);
    }, [q, router, pathname, params]);

    return (
        <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cursos..."
            className="w-full sm:w-72 rounded-xl border border-border bg-surface px-3 py-2"
        />
    );
}