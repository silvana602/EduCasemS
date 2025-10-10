"use client";

import { useState } from "react";
import CoursePlayerLayout, {
    type OutlineSection,
} from "@/components/courses/CoursePlayerLayout";
import VideoPlayer from "@/components/courses/VideoPlayer";

type Props = {
    courseId: string;
    sectionsInitial: OutlineSection[];
    currentLessonId: string;
    nextLessonId?: string;
};

export default function ClientLessonPlayer({
    courseId,
    sectionsInitial,
    currentLessonId,
    nextLessonId,
}: Props) {
    const [sections, setSections] = useState<OutlineSection[]>(sectionsInitial);

    // Guardado optimista: marcar una lección como completada en el sidebar
    const onOptimisticToggle = (lessonId: string, completed: boolean) => {
        setSections((prev) =>
            prev.map((s) => ({
                ...s,
                lessons: s.lessons.map((l) =>
                    l.id === lessonId ? { ...l, completed } : l
                ),
            }))
        );
    };

    return (
        <CoursePlayerLayout
            courseId={courseId}
            currentLessonId={currentLessonId}
            sections={sections}
            onOptimisticToggle={(id, completed) => onOptimisticToggle(id, completed)}
        >
            <div className="rounded-2xl border border-border bg-surface p-3">
                <div className="grid gap-3">
                    <VideoPlayer
                        lessonId={currentLessonId}
                        nextLessonId={nextLessonId}
                        onCompleted={() => onOptimisticToggle(currentLessonId, true)}
                    />
                </div>
            </div>
        </CoursePlayerLayout>
    );
}