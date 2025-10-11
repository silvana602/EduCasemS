"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";
import type { User } from "@/types/user";
import Avatar from "@/components/ui/Avatar";

type ProfileResponse = Pick<User, "id" | "name" | "email" | "role" | "avatarUrl">;

export default function SettingsPage() {
    const [tab, setTab] = useState<"profile" | "password">("profile");

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-semibold mb-4 text-fg">Configuración</h1>

            {/* Tabs */}
            <div className="inline-flex rounded-2xl border border-border bg-surface overflow-hidden mb-6">
                <button
                    onClick={() => setTab("profile")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "profile" ? "bg-brand-soft" : "hover:bg-brand-soft"
                        }`}
                >
                    Perfil
                </button>
                <button
                    onClick={() => setTab("password")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "password" ? "bg-brand-soft" : "hover:bg-brand-soft"
                        }`}
                >
                    Contraseña
                </button>
            </div>

            {tab === "profile" ? <ProfileCard /> : <PasswordCard />}
        </div>
    );
}

function ProfileCard() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.auth.user);

    const [loading, setLoading] = useState(!user);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState(user?.name ?? "");
    const [email] = useState(user?.email ?? "");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl ?? null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) return;
        (async () => {
            try {
                const res = await fetch("/api/profile", { cache: "no-store" });
                const data = (await res.json()) as ProfileResponse;

                const merged: User = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    avatarUrl: data.avatarUrl ?? null,
                };

                dispatch(setCredentials({ user: merged, accessToken: undefined }));
                setName(merged.name);
                setAvatarUrl(merged.avatarUrl ?? null);
            } finally {
                setLoading(false);
            }
        })();
    }, [user, dispatch]);

    const canSave = useMemo(() => {
        const baseChanged = name.trim() !== (user?.name ?? "");
        const currentReal = user?.avatarUrl ?? null;
        const nextReal = localPreview ? "__local_preview__" : (avatarUrl ?? null);
        const avatarChanged = nextReal !== currentReal;
        return !!name.trim() && (baseChanged || avatarChanged);
    }, [name, avatarUrl, localPreview, user]);

    function onPickFile(file?: File) {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setLocalPreview(url);
    }

    async function onSave() {
        setSaving(true);
        try {
            const avatarToSave = localPreview ?? avatarUrl;

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), avatarUrl: avatarToSave }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                alert(error ?? "No se pudo guardar.");
                return;
            }

            const updated = (await res.json()) as ProfileResponse;

            const merged: User = {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
                avatarUrl: updated.avatarUrl ?? null,
            };

            dispatch(setCredentials({ user: merged, accessToken: undefined }));
            setLocalPreview(null);
            setAvatarUrl(merged.avatarUrl ?? null);
            alert("Perfil actualizado.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="text-sm text-fg/70">Cargando…</div>;

    return (
        <div className="rounded-2xl border border-border p-4 sm:p-6 bg-surface">
            <h2 className="text-lg font-semibold mb-4">Perfil</h2>

            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24">
                        <Avatar
                            name={user?.name ?? name}
                            src={localPreview ?? avatarUrl ?? user?.avatarUrl ?? null}
                            size={96}
                        />
                    </div>

                    <label className="text-xs font-medium px-3 py-1.5 rounded-xl border border-border cursor-pointer hover:bg-brand-soft transition-colors">
                        Subir avatar
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => onPickFile(e.target.files?.[0] as File)}
                        />
                    </label>

                    <button
                        type="button"
                        className="text-xs text-red-600 hover:underline"
                        onClick={() => {
                            setAvatarUrl(null);
                            setLocalPreview(null);
                        }}
                    >
                        Quitar avatar
                    </button>
                </div>

                {/* Formulario */}
                <div className="flex-1">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Nombre</label>
                            <input
                                className="w-full rounded-xl border border-border px-3 py-2 bg-surface"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                className="w-full rounded-xl border border-border px-3 py-2 bg-[color:color-mix(in_oklab,rgb(var(--fg))_6%,transparent)]"
                                value={email || user?.email || ""}
                                disabled
                            />
                            <p className="text-xs text-fg/70 mt-1">
                                El correo no se puede editar desde esta vista.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <button
                            onClick={onSave}
                            disabled={!canSave || saving}
                            className="px-4 py-2 rounded-xl bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                        <button
                            onClick={() => {
                                setName(user?.name ?? "");
                                setAvatarUrl(user?.avatarUrl ?? null);
                                setLocalPreview(null);
                            }}
                            className="px-4 py-2 rounded-xl border border-border hover:bg-brand-soft transition-colors"
                        >
                            Restablecer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PasswordCard() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [saving, setSaving] = useState(false);

    async function onChangePassword() {
        if (newPassword !== confirm) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data?.message ?? "No se pudo cambiar la contraseña.");
                return;
            }
            alert("Contraseña actualizada (mock).");
            setCurrentPassword("");
            setNewPassword("");
            setConfirm("");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="rounded-2xl border border-border p-4 sm:p-6 bg-surface">
            <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>

            <div className="grid gap-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Contraseña actual</label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-border px-3 py-2 bg-surface"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    <p className="text-xs text-fg/70 mt-1">
                        MOCK: usa <code>123456</code> como válida.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-border px-3 py-2 bg-surface"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-border px-3 py-2 bg-surface"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repite la contraseña"
                    />
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <button
                    onClick={onChangePassword}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-50 transition-colors"
                >
                    {saving ? "Actualizando..." : "Actualizar contraseña"}
                </button>
                <button
                    onClick={() => {
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirm("");
                    }}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-brand-soft transition-colors"
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
}