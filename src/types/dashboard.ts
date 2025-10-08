import type { Course } from "./course";

export interface MyCourse {
    course: Course;
    total: number;
    completed: number;
    progressPct: number;
    lastLessonId?: string;
    nextLessonId?: string;
    firstLessonId?: string;
}