"use client";

import { useState } from "react";
import CoursePlayerLayout, { type OutlineSection } from "./CoursePlayerLayout";
import VideoPlayer from "./VideoPlayer";

type Props = {
    courseId: string;
    sectionsInitial: OutlineSection[];
    currentLessonId: string;
    nextLessonId?: string;
    videoUrl?: string | null;         // 👈 NUEVO
};

export default function ClientLessonPlayer({
    courseId,
    sectionsInitial,
    currentLessonId,
    nextLessonId,
    videoUrl,
}: Props) {
    const [sections, setSections] = useState(sectionsInitial);

    // optimismo: cuando el video termina marcamos como hecha la lección actual
    const markCurrentAsDone = () => {
        setSections((prev) =>
            prev.map((sec) => ({
                ...sec,
                lessons: sec.lessons.map((l) =>
                    l.id === currentLessonId ? { ...l, done: true } : l
                ),
            }))
        );
    };

    return (
        <CoursePlayerLayout
            courseId={courseId}
            sections={sections}
            currentLessonId={currentLessonId}
        >
            <div className="rounded-2xl border border-border bg-surface p-3">
                <VideoPlayer
                    lessonId={currentLessonId}
                    videoUrl={videoUrl ?? undefined}  // 👈 SE REENVÍA AL PLAYER
                    nextLessonId={nextLessonId}
                    onCompleted={markCurrentAsDone}
                />
            </div>
        </CoursePlayerLayout>
    );
}