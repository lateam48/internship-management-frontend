import { apiClient } from "@/lib/axios";
import getEnv from "@/lib/env";

// Define profile types
export type Profile = {
    id: string;
    name: string;
    email: string;
    role: string;
    imageUrl?: string;
    studentId?: string;
    department?: string;
};

export type UpdateProfileData = {
    name?: string;
    email?: string;
    image?: File;
};

const PROFILE_BASE_URL = `${getEnv().apiUrl}/api/profile`;

export const profileService = {
    getProfile: async (): Promise<Profile> => {
        const response = await apiClient.get<Profile>(PROFILE_BASE_URL);
        return response.data;
    },

    updateProfile: async (data: UpdateProfileData): Promise<Profile> => {
        const formData = new FormData();

        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.image) formData.append("image", data.image);

        const response = await apiClient.put<Profile>(PROFILE_BASE_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },

    updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await apiClient.patch(`${PROFILE_BASE_URL}/password`, {
            currentPassword,
            newPassword,
        });
    },
};