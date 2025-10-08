import type { LoginDto, RegisterDto, AuthResponse, User } from "@/types/auth";
import { clientFetch } from "@/lib/api/client";

export async function login(body: LoginDto): Promise<AuthResponse> {
  return clientFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function register(body: RegisterDto): Promise<AuthResponse> {
  return clientFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function logout(): Promise<void> {
  await clientFetch("/auth/logout", { method: "POST" });
}

export async function me(): Promise<User | null> {
  try {
    const res = await clientFetch<{ user: User }>("/auth/me", { method: "GET" });
    return res.user;
  } catch {
    return null;
  }
}