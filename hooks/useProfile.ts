"use client"

import { useQuery } from "@tanstack/react-query"
import type { UserProfile } from "@/services/profileService"

export function useProfile(initialData?: UserProfile) {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            // This would call your API endpoint
            const response = await fetch("/api/profile")
            if (!response.ok) throw new Error("Failed to fetch profile")
            return response.json()
        },
        initialData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}