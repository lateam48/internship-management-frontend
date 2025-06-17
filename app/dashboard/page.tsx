import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {LogoutButton} from "@/components/global";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

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