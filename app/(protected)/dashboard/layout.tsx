import type React from "react"
import { getAuthenticatedUser } from "@/lib/serverAuth"
import { UserRoles } from "@/types"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar, Navbar } from "@/components/layout"

export default async function DashboardLayout({children, admin, teacher, student, company}: Readonly<{
    children: React.ReactNode
    admin: React.ReactNode
    teacher: React.ReactNode
    student: React.ReactNode
    company: React.ReactNode
}>) {
    const { session } = await getAuthenticatedUser({
        allowedRoles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.COMPANY],
        authRedirect: "/login",
        authzRedirect: "/unauthorized",
    })

    // Render role-specific content using slots
    const renderRoleContent = () => {
        switch (session?.user?.role) {
            case UserRoles.ADMIN:
                return admin
            case UserRoles.TEACHER:
                return teacher
            case UserRoles.STUDENT:
                return student
            case UserRoles.COMPANY:
                return company
            default:
                return children
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar session={session} />
            <SidebarInset>
                <Navbar session={session} />
                <main className="flex-1 space-y-4 p-4 md:p-8">{renderRoleContent()}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}