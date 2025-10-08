"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function EnrollButton({ courseId }: { courseId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    async function onEnroll() {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
            if (res.status === 401) {
                // si no hay sesión → enviar a login y volver al curso
                router.push(`/login?next=${encodeURIComponent(pathname)}`);
                return;
            }
            // inscripto: refrescar la página para que aparezca el estado actualizado
            router.refresh();
        } catch {
            // no-op en mock
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={onEnroll}
            disabled={loading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-800 disabled:opacity-60"
        >
            {loading ? "Inscribiendo..." : "Inscribirme"}
        </button>
    );
}