import { hardResetDb, seedOnce } from "@/mocks/db";

/**
 * Resetea la BD mock y la vuelve a poblar.
 * Devuelve 204 (sin body) para mantener compatibilidad con el cliente actual.
 */
export async function POST() {
    try {
        hardResetDb();
        seedOnce();
        return new Response(null, { status: 204 });
    } catch (err) {
        console.error("[DEV RESET] error:", err);
        return new Response(JSON.stringify({ ok: false, error: "reset_failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}