"use client";

import { useEffect, useState } from "react";
import { clientFetch } from "@/lib/api/client";

export default function VideoPlayer({ lessonId }: { lessonId: string }) {
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await clientFetch<{ signedUrl: string }>(`/lessons/${lessonId}/playback`, {
                    method: "GET",
                });
                if (alive) setUrl(res.signedUrl);
            } catch (e: any) {
                if (alive) setError(e?.message ?? "No se pudo cargar el video");
            }
        })();
        return () => { alive = false; };
    }, [lessonId]);

    if (error) return <p className="text-sm text-red-600">{error}</p>;
    if (!url) return <p className="text-sm text-fg/70">Cargando video…</p>;

    return (
        <video
            key={url}
            src={url}
            controls
            className="w-full rounded-xl bg-black"
            preload="metadata"
        />
    );
}