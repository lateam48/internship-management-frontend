import "next-auth";

declare module "next-auth" {
    interface User {
        accessToken?: string;
        role?: string;
        id?: string;
    }

    interface Session {
        accessToken?: string;
        user?: {
            id?: string;
            role?: string;
        } & Session["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        role?: string;
        id?: string;
    }
}