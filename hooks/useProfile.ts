import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";
import { useSession } from "next-auth/react";

export const useProfile = () => {
    const queryClient = useQueryClient();
    const { update } = useSession();

    // Get profile data
    const profileQuery = useQuery({
        queryKey: ["profile"],
        queryFn: profileService.getProfile,
        retry: 1,
    });

    // Update profile
    const updateProfileMutation = useMutation({
        mutationFn: profileService.updateProfile,
        onSuccess: async (updatedProfile) => {
            // Update session data
            await update({
                user: {
                    ...updatedProfile,
                    image: updatedProfile.imageUrl,
                },
            });

            // Update query cache
            queryClient.setQueryData(["profile"], updatedProfile);
        },
    });

    // Update password
    const updatePasswordMutation = useMutation({
        mutationFn: async (passwords: { current: string; new: string }) => {
            await profileService.updatePassword(passwords.current, passwords.new);
        },
    });

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isError: profileQuery.isError,
        error: profileQuery.error,

        updateProfile: updateProfileMutation.mutateAsync,
        isUpdatingProfile: updateProfileMutation.isPending,

        updatePassword: updatePasswordMutation.mutateAsync,
        isUpdatingPassword: updatePasswordMutation.isPending,
    };
};