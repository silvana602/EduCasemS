import type { Role } from "./role";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string | null;
    isActive?: boolean;
}