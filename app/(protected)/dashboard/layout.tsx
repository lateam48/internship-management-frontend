import {getAuthenticatedUser} from "@/lib/serverAuth";
import { UserRoles } from "@/types";


export default async function DashboardLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const {session} = await getAuthenticatedUser({
        allowedRoles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
        authRedirect: "/login",
        authzRedirect: "/unauthorized",
    });
    console.log("Session role:", session?.user?.role);
    return (
        <>
            // optional pass session context if needed
            {children}
        </>
    );
}
