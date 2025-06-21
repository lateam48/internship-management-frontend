// hooks/useSessionData.ts
"use client"

import { useSession } from "next-auth/react"
import { UserRole } from "@/types"

export const useSessionData = () => {
    const { data: session, status } = useSession()

    return {
        user: session?.user,
        role: session?.user?.role as UserRole | undefined,
        accessToken: session?.accessToken as string | undefined,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated"
    }
}