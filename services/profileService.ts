import { z } from "zod"

export const UserProfileSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().email(),
    role: z.string(),
    image: z.string().nullable(),
    createdAt: z.string().optional(),
    lastLogin: z.string().optional(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>

// Server-side function to get user profile
export async function getUserProfile(userId: string): Promise<UserProfile> {
    // This would typically fetch from your database
    // For now, we'll return mock data based on the session
    return {
        id: userId,
        name: "User Name",
        email: "user@example.com",
        role: "STUDENT",
        image: null,
    }
}
