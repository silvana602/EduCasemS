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