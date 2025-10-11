import type { User } from "@/types/user";

export function resolveAvatarUrl(
    user?: Pick<User, "avatarUrl"> | null,
    override?: string | null,
    fallback: string = "/default-avatar.webp"
) {
    if (override) return override;
    if (override === "") return fallback;
    if (user?.avatarUrl) return user.avatarUrl;
    return fallback;
}