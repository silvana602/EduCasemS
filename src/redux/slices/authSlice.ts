import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    hydrated: boolean; // indica si ya intentamos hidratar desde /auth/me
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    hydrated: false,
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Permite setear con o sin accessToken (para /auth/me)
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken?: string | null }>
        ) => {
            state.user = action.payload.user;
            state.accessToken =
                action.payload.accessToken === undefined ? state.accessToken : action.payload.accessToken;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
        },
        setHydrated: (state, action: PayloadAction<boolean>) => {
            state.hydrated = action.payload;
        },
    },
});

export const { setCredentials, logout, setHydrated } = slice.actions;
export default slice.reducer;