"use client";

import { useEffect, useMemo, useState } from "react";
import RoleGate from "@/components/auth/RoleGate";

type Role = "student" | "instructor" | "admin";
type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string | null;
    isActive?: boolean;
};

type UsersResp = {
    page: number;
    pageSize: number;
    total: number;
    items: User[];
};

export default function AdminUsersPage() {
    const [data, setData] = useState<UsersResp | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState<Role | "">("");
    const [active, setActive] = useState<"" | "true" | "false">("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const qs = useMemo(() => {
        const p = new URLSearchParams();
        if (search) p.set("search", search);
        if (role) p.set("role", role);
        if (active) p.set("active", active);
        p.set("page", String(page));
        p.set("pageSize", String(pageSize));
        return p.toString();
    }, [search, role, active, page]);

    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(`/api/admin/users?${qs}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const json = (await res.json()) as UsersResp;
            setData(json);
        } catch (e: any) {
            setErr(e?.message ?? "No se pudo cargar");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qs]);

    async function toggleActive(u: User) {
        const res = await fetch(`/api/admin/users/${u.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !(u.isActive ?? true) }),
        });
        if (res.ok) load();
    }

    async function changeRole(u: User, next: Role) {
        const res = await fetch(`/api/admin/users/${u.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: next }),
        });
        if (res.ok) load();
    }

    const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

    return (
        <RoleGate allow={["admin"]}>
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Usuarios</h1>

                <div className="flex flex-wrap gap-2 items-end">
                    <label className="grid gap-1">
                        <span className="text-xs">Buscar</span>
                        <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="rounded-xl border px-3 py-2" placeholder="Nombre o correo" />
                    </label>
                    <label className="grid gap-1">
                        <span className="text-xs">Rol</span>
                        <select value={role} onChange={(e) => { setPage(1); setRole(e.target.value as any); }} className="rounded-xl border px-3 py-2">
                            <option value="">Todos</option>
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <label className="grid gap-1">
                        <span className="text-xs">Estado</span>
                        <select value={active} onChange={(e) => { setPage(1); setActive(e.target.value as any); }} className="rounded-xl border px-3 py-2">
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </label>
                </div>

                {loading && <div className="text-sm opacity-70">Cargando…</div>}
                {err && <div className="text-sm text-red-600">{err}</div>}

                {data && (
                    <>
                        <div className="overflow-x-auto rounded-2xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-brand-50/40 text-left">
                                    <tr>
                                        <th className="px-3 py-2">Nombre</th>
                                        <th className="px-3 py-2">Correo</th>
                                        <th className="px-3 py-2">Rol</th>
                                        <th className="px-3 py-2">Estado</th>
                                        <th className="px-3 py-2 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((u) => (
                                        <tr key={u.id} className="border-t">
                                            <td className="px-3 py-2">{u.name}</td>
                                            <td className="px-3 py-2">{u.email}</td>
                                            <td className="px-3 py-2">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => changeRole(u, e.target.value as Role)}
                                                    className="rounded-lg border px-2 py-1"
                                                >
                                                    <option value="student">student</option>
                                                    <option value="instructor">instructor</option>
                                                    <option value="admin">admin</option>
                                                </select>
                                            </td>
                                            <td className="px-3 py-2">
                                                {(u.isActive ?? true) ? (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Activo</span>
                                                ) : (
                                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">Inactivo</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <button
                                                    onClick={() => toggleActive(u)}
                                                    className="rounded-lg border px-3 py-1 hover:bg-brand-50"
                                                >
                                                    {(u.isActive ?? true) ? "Desactivar" : "Activar"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {data.items.length === 0 && (
                                        <tr><td className="px-3 py-6 text-center text-fg/70" colSpan={5}>Sin resultados</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Anterior</button>
                            <span className="text-sm">Página {page} / {totalPages}</span>
                            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Siguiente</button>
                        </div>
                    </>
                )}
            </div>
        </RoleGate>
    );
}