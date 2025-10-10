import type { User } from "./user";

/** User con `password` solo para la DB en memoria (mock). */
export interface MockUser extends User {
    password: string;
}