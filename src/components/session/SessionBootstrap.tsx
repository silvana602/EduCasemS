"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCredentials, setHydrated } from "@/redux/slices/authSlice";
import { me } from "@/services/auth.service";

/**
 * Al montarse en el cliente:
 * - Llama a /api/auth/me usando la cookie HttpOnly
 * - Si hay user, hidrata Redux (sin tocar accessToken)
 * - Marca hydrated=true para evitar dobles llamadas
 */
export default function SessionBootstrap() {
    const dispatch = useAppDispatch();
    const hydrated = useAppSelector((s) => s.auth.hydrated);

    useEffect(() => {
        if (hydrated) return;
        (async () => {
            const user = await me();
            if (user) dispatch(setCredentials({ user }));
            dispatch(setHydrated(true));
        })();
    }, [hydrated, dispatch]);

    return null; // no renderiza nada
}