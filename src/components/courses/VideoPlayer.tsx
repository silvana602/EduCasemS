"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoPlayer({
    lessonId,
    nextLessonId,
    onCompleted, // callback para optimismo en el sidebar
}: {
    lessonId: string;
    nextLessonId?: string;
    onCompleted?: () => void;
}) {
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const vidRef = useRef<HTMLVideoElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`/api/lessons/${lessonId}`, { cache: "no-store" });
                if (!res.ok) throw new Error("No se pudo cargar la lección");
                const data = await res.json();
                const candidate = data.videoUrl ?? data.signedUrl ?? data.url;
                if (!candidate) throw new Error("La lección no tiene video");
                if (alive) setUrl(candidate);
            } catch (e: any) {
                if (alive) setError(e?.message ?? "Error cargando video");
            }
        })();
        return () => {
            alive = false;
        };
    }, [lessonId]);

    // Atajos: J/K/L/F/Space (igual que antes)
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const v = vidRef.current;
            if (!v) return;
            if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

            if (e.key === "j" || e.key === "J") v.currentTime = Math.max(0, v.currentTime - 10);
            else if (e.key === "l" || e.key === "L") v.currentTime = Math.min(v.duration || Infinity, v.currentTime + 10);
            else if (e.key === "k" || e.key === "K" || e.code === "Space") {
                e.preventDefault();
                if (v.paused) v.play(); else v.pause();
            } else if (e.key === "f" || e.key === "F") {
                if (document.fullscreenElement) document.exitFullscreen(); else v.requestFullscreen().catch(() => { });
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    async function markCompleted() {
        if (saving) return;
        setSaving(true);

        // OPTIMISTA: avisar al padre antes del POST
        onCompleted?.();

        try {
            await fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
            router.refresh();
        } finally {
            setSaving(false);
        }
    }

    async function handleEnded() {
        await markCompleted();
        if (nextLessonId) {
            // construye la ruta siguiente con la URL actual
            const parts = typeof window !== "undefined" ? window.location.pathname.split("/") : [];
            const idx = parts.indexOf("course");
            const courseId = idx >= 0 ? parts[idx + 1] : "";
            const href = nextLessonId.startsWith("/course")
                ? nextLessonId
                : `/course/${courseId}/lesson/${nextLessonId}`;
            router.push(href);
        }
    }

    if (!url) return <p className="text-sm text-fg/70">Cargando video… {error && `(${error})`}</p>;

    return (
        <div className="grid gap-3">
            <video
                key={`${lessonId}:${url}`}
                ref={vidRef}
                src={url}
                controls
                className="w-full rounded-xl bg-black"
                preload="metadata"
                onEnded={handleEnded}
            />
            <div className="flex items-center gap-2">
                <button
                    onClick={markCompleted}
                    disabled={saving}
                    className="rounded-md bg-brand-600 px-3 py-1 text-xs text-white hover:bg-brand-800 disabled:opacity-60"
                >
                    {saving ? "Guardando…" : "Marcar como completada"}
                </button>
                {error && <span className="text-xs text-red-600">{error}</span>}
            </div>
        </div>
    );
}