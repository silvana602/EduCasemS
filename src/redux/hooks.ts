// src/redux/hooks.ts
import { useDispatch, useSelector, shallowEqual, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/**
 * Dispatch tipado para usar en componentes Client:
 * const dispatch = useAppDispatch();
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Selector tipado para leer del estado global:
 * const user = useAppSelector(s => s.auth.user);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Selector con shallowEqual para evitar renders innecesarios cuando
 * el selector devuelve objetos/arrays pequeños.
 * Uso:
 * const { user, accessToken } = useShallowSelector(s => ({
 *   user: s.auth.user,
 *   accessToken: s.auth.accessToken,
 * }));
 */
export function useShallowSelector<TSelected>(
    selector: (state: RootState) => TSelected
): TSelected {
    return useSelector(selector, shallowEqual);
}