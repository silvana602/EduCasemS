"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    lessonId: string;
    videoUrl?: string | null;
    nextLessonId?: string;
    onCompleted?: () => void;
};

export default function VideoPlayer({ lessonId, videoUrl, nextLessonId, onCompleted }: Props) {
    const ref = useRef<HTMLVideoElement | null>(null);
    const router = useRouter();

    const storageKey = useMemo(() => `vp:${lessonId}:t`, [lessonId]);
    const [resumeAt, setResumeAt] = useState<number | null>(null);
    const [showResume, setShowResume] = useState(false);
    const [isEnding, setIsEnding] = useState(false);

    // leer tiempo guardado
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            const t = raw ? Math.max(0, Number(raw)) : NaN;
            if (!Number.isNaN(t) && t > 3) {
                setResumeAt(t);
                setShowResume(true);
            }
        } catch { }
    }, [storageKey]);

    // guardar cada ~3s
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let last = 0;
        const onTime = () => {
            const t = Math.floor(el.currentTime);
            if (Math.abs(t - last) >= 3) {
                last = t;
                try {
                    localStorage.setItem(storageKey, String(t));
                } catch { }
            }
        };
        el.addEventListener("timeupdate", onTime);
        return () => el.removeEventListener("timeupdate", onTime);
    }, [storageKey]);

    // atajos J/K/L/F
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const v = ref.current;
            if (!v) return;
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;

            const k = e.key.toLowerCase();
            if (k === "j") v.currentTime = Math.max(0, v.currentTime - 10);
            else if (k === "l") v.currentTime = Math.min(v.duration || Infinity, v.currentTime + 10);
            else if (k === "k" || e.code === "Space") {
                e.preventDefault();
                v.paused ? v.play().catch(() => { }) : v.pause();
            } else if (k === "f") {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
                else v.requestFullscreen?.().catch(() => { });
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const handleEnded = async () => {
        setIsEnding(true);
        try {
            await fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
        } catch { }
        onCompleted?.();
        try {
            localStorage.removeItem(storageKey);
        } catch { }

        if (nextLessonId) {
            const t = setTimeout(() => {
                const m = location.pathname.match(/\/course\/([^/]+)/);
                const courseId = m?.[1] ?? "";
                router.push(`/course/${courseId}/lesson/${nextLessonId}`);
            }, 2000);
            return () => clearTimeout(t);
        }
    };

    const resumeFromStored = () => {
        const v = ref.current;
        if (!v || resumeAt == null) return;
        v.currentTime = resumeAt;
        setShowResume(false);
    };

    const discardResume = () => {
        setShowResume(false);
        try {
            localStorage.removeItem(storageKey);
        } catch { }
    };

    const src = videoUrl || `/videos/${lessonId}.mp4`;

    return (
        <div className="relative">
            <video
                ref={ref}
                className="w-full rounded-xl border border-border bg-black"
                controls
                playsInline
                onEnded={handleEnded}
            >
                <source src={src} type="video/mp4" />
            </video>

            {showResume && resumeAt != null && (
                <div className="pointer-events-auto absolute left-3 top-3 z-10 max-w-[90%] rounded-lg border border-border bg-surface/95 p-3 shadow">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-fg/80">
                            ¿Reanudar desde <strong>{fmt(resumeAt)}</strong>?
                        </span>
                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={resumeFromStored}
                                className="rounded-md bg-brand-600 px-2 py-1 text-xs text-white hover:bg-brand-800"
                            >
                                Reanudar
                            </button>
                            <button
                                onClick={discardResume}
                                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-brand-50"
                            >
                                Empezar de 0
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEnding && (
                <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-end pr-3">
                    {nextLessonId ? (
                        <div className="pointer-events-auto rounded-md bg-brand-600 px-3 py-2 text-xs text-white shadow">
                            Reproduciendo la siguiente lección…
                        </div>
                    ) : (
                        <div className="rounded-md bg-brand-600 px-3 py-2 text-xs text-white shadow">
                            ¡Lección completada!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function fmt(t: number) {
    const mm = Math.floor(t / 60);
    const ss = Math.floor(t % 60);
    return `${String(mm)}:${String(ss).padStart(2, "0")}`;
}