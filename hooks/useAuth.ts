"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {UserRole} from "@/types";

export const useAuth = (options?: {
    redirectTo?: string;
    allowedRoles?: UserRole[];
    redirectIfUnauthorized?: string;
}) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const userRole = session?.user?.role as UserRole | undefined;

    useEffect(() => {
        if (isLoading) return;

        // Handle authentication redirect
        if (!isAuthenticated && options?.redirectTo) {
            router.replace(options.redirectTo);
            return;
        }

        // Handle authorization redirect
        if (
            isAuthenticated &&
            options?.allowedRoles &&
            options.redirectIfUnauthorized
        ) {
            const hasRequiredRole = userRole && options.allowedRoles.includes(userRole);

            if (!hasRequiredRole) {
                router.replace(options.redirectIfUnauthorized);
            }
        }
    }, [isLoading, isAuthenticated, userRole, options, router]);

    // Role checking utility
    const hasRole = (roles: UserRole | UserRole[]) => {
        if (!userRole) return false;
        return Array.isArray(roles)
            ? roles.includes(userRole)
            : roles === userRole;
    };

    return {
        session,
        isLoading,
        isAuthenticated,
        userRole,
        hasRole,
    };
};