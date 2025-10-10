export interface Lesson {
    id: string;
    courseId: string;
    sectionId: string;
    title: string;
    durationMin: number;
    order: number;
    resources?: { id: string; name: string; url: string }[];
    videoUrl?: string;
}