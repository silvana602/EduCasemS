"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCredentials, setHydrated } from "@/redux/slices/authSlice";
import { me } from "@/services/auth.service";
import type { User } from "@/types";

/**
 * - Se monta SIEMPRE desde el root layout dentro de <Providers>.
 * - Llama una sola vez a /auth/me (vía clientFetch) para hidratar Redux.
 * - Si hay sesión, guarda { user }. (No exigimos token).
 */
export default function SessionBootstrap() {
    const dispatch = useAppDispatch();
    const hydrated = useAppSelector((s) => s.auth.hydrated);
    const triedRef = useRef(false);

    useEffect(() => {
        if (hydrated || triedRef.current) return;
        triedRef.current = true;

        (async () => {
            try {
                const user: User | null = await me();
                if (user) {
                    dispatch(setCredentials({ user, accessToken: null }));
                }
            } catch {
            } finally {
                dispatch(setHydrated(true));
            }
        })();
    }, [hydrated, dispatch]);

    return null;
}