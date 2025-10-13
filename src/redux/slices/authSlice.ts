import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

type AuthState = {
    user: User | null;
    accessToken: string | null;
    hydrated: boolean;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
    hydrated: false,
};

type SetCredentialsPayload = {
    user: User;
    accessToken?: string | null;
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken ?? null;
            state.hydrated = true;
        },
        setHydrated: (state, action: PayloadAction<boolean>) => {
            state.hydrated = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.hydrated = true;
        },
    },
});

export const { setCredentials, setHydrated, logout } = authSlice.actions;
export default authSlice.reducer;