export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: "beginner" | "intermediate" | "advanced";
    price: number;
    thumbnailUrl: string;
    instructorId: string;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    durationMin: number;
    order: number;
    resources?: { id: string; name: string; url: string }[];
}