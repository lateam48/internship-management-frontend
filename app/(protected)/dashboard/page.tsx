import {LogoutButton} from "@/components/global";
import {getAuthenticatedUser} from "@/lib/serverAuth";

export default async function DashboardPage() {
    const {session} = await getAuthenticatedUser({
        authRedirect: "/login"
    });

    return (
        <section className="grid place-content-center h-screen gap-4">
            <LogoutButton />
            <div className={"rounded-md shadow-md bg-accent max-w-md w-full p-4 overflow-x-auto"}>
                <h1>Welcome, {session.user?.name}</h1>
                <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
        </section>
    );
}