import "next-auth";
import type { Session } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
        accessToken?: string;
    }

    interface Session {
        user: User;
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: string;
        accessToken?: string;
    }
}


export type AuthSession = {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: UserRole;
    };
    accessToken?: string;
} | null;