"use client";

import { RoleGate } from "@/components/auth";
import { useState } from "react";

export default function AdminSettingsPage() {
    const [brand, setBrand] = useState("Educasem");
    const [currency, setCurrency] = useState("BOB");
    const [allowSelfEnroll, setAllowSelfEnroll] = useState(true);

    return (
        <RoleGate allow={["admin"]}>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Configuración</h1>

                <div className="grid gap-4 max-w-2xl">
                    <label className="grid gap-1">
                        <span className="text-xs">Nombre de marca</span>
                        <input value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-xl border px-3 py-2" />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-xs">Moneda</span>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded-xl border px-3 py-2">
                            <option value="BOB">BOB</option>
                            <option value="USD">USD</option>
                        </select>
                    </label>

                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={allowSelfEnroll} onChange={(e) => setAllowSelfEnroll(e.target.checked)} />
                        <span className="text-sm">Permitir auto-inscripción en cursos gratuitos</span>
                    </label>

                    <div className="pt-2">
                        <button className="rounded-xl bg-brand-600 px-4 py-2 text-white hover:bg-brand-800">Guardar cambios</button>
                    </div>
                </div>

                <section className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Integraciones</h2>
                    <div className="rounded-2xl border p-4 text-sm text-fg/80">
                        <p>Próximamente: configuración de pasarelas de pago, webhooks, SMTP/Zoho, etc.</p>
                    </div>
                </section>
            </div>
        </RoleGate>
    );
}