export type Role = "admin" | "instructor" | "student";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string | null;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
}