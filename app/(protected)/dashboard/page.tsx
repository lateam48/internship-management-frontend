import { getAuthenticatedUser } from "@/lib/serverAuth"

export default async function DashboardPage() {
    const { session } = await getAuthenticatedUser({
        authRedirect: "/login",
    })

    // This page should redirect to role-specific content
    // The layout will handle rendering the appropriate slot
    return null
}