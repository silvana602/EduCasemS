import type { Course } from "@/types/course";
import Link from "next/link";
import Image from "next/image";

export default function CourseCard({ course }: { course: Course }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <Link href={`/course/${course.id}`} className="block">
                <div className="relative h-40 w-full">
                    <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover"
                        priority={false}
                    />
                </div>
            </Link>

            <div className="grid gap-2 p-4">
                <Link href={`/course/${course.id}`} className="text-base font-semibold hover:underline">
                    {course.title}
                </Link>
                <p className="line-clamp-2 text-sm text-fg/70">{course.description}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-fg/70">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-heading">{course.category}</span>
                    <span className="capitalize">{course.level}</span>
                </div>
            </div>
        </article>
    );
}