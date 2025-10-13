"use client";

import RoleGate from "@/components/auth/RoleGate";
import { useEffect, useMemo, useState } from "react";

type Row = {
    id: string;
    status: string;
    amountBOB: number;
    studentId: string;
    studentEmail: string;
    createdAt: string;
};
type Resp = { page: number; pageSize: number; total: number; items: Row[] };

export default function AdminOrdersPage() {
    const [data, setData] = useState<Resp | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const qs = useMemo(() => {
        const p = new URLSearchParams();
        if (status) p.set("status", status);
        p.set("page", String(page));
        p.set("pageSize", String(pageSize));
        return p.toString();
    }, [status, page]);

    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const r = await fetch(`/api/admin/orders?${qs}`, { cache: "no-store" });
            if (!r.ok) throw new Error(`Error ${r.status}`);
            setData(await r.json());
        } catch (e: any) {
            setErr(e?.message ?? "No se pudo cargar");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); /* eslint-disable-next-line */ }, [qs]);

    async function setStatusOrder(id: string, status: "paid" | "pending" | "refunded" | "canceled") {
        const r = await fetch(`/api/admin/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (r.ok) load();
    }

    const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

    return (
        <RoleGate allow={["admin"]}>
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Órdenes</h1>

                <div className="flex flex-wrap gap-2 items-end">
                    <label className="grid gap-1">
                        <span className="text-xs">Estado</span>
                        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-xl border px-3 py-2">
                            <option value="">Todos</option>
                            <option value="pending">Pendiente</option>
                            <option value="paid">Pagado</option>
                            <option value="refunded">Reembolsado</option>
                            <option value="canceled">Cancelado</option>
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
                                        <th className="px-3 py-2">ID</th>
                                        <th className="px-3 py-2">Alumno</th>
                                        <th className="px-3 py-2">Monto (BOB)</th>
                                        <th className="px-3 py-2">Estado</th>
                                        <th className="px-3 py-2">Fecha</th>
                                        <th className="px-3 py-2 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((o) => (
                                        <tr key={o.id} className="border-t">
                                            <td className="px-3 py-2">{o.id}</td>
                                            <td className="px-3 py-2">{o.studentEmail || o.studentId}</td>
                                            <td className="px-3 py-2">{o.amountBOB.toFixed(2)}</td>
                                            <td className="px-3 py-2 capitalize">{o.status}</td>
                                            <td className="px-3 py-2">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</td>
                                            <td className="px-3 py-2 text-right space-x-2">
                                                <button onClick={() => setStatusOrder(o.id, "pending")} className="rounded-lg border px-2 py-1 hover:bg-brand-50">Pendiente</button>
                                                <button onClick={() => setStatusOrder(o.id, "paid")} className="rounded-lg border px-2 py-1 hover:bg-brand-50">Pagado</button>
                                                <button onClick={() => setStatusOrder(o.id, "refunded")} className="rounded-lg border px-2 py-1 hover:bg-brand-50">Reembolsar</button>
                                                <button onClick={() => setStatusOrder(o.id, "canceled")} className="rounded-lg border px-2 py-1 hover:bg-brand-50">Cancelar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.items.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-fg/70">Sin resultados</td></tr>}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Anterior</button>
                            <span className="text-sm">Página {page} / {totalPages}</span>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Siguiente</button>
                        </div>
                    </>
                )}
            </div>
        </RoleGate>
    );
}