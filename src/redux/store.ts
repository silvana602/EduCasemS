import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        auth,
    },
    devTools: process.env.NODE_ENV !== "production",
});

// Tipos derivados del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;