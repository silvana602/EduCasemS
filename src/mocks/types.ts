export type Role = "admin" | "instructor" | "student";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string | null;
    password?: string; // solo mock
}

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

export interface AuthResponse {
    accessToken: string;
    user: User;
}