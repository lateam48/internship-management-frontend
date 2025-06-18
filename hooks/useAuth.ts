"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * A client-side hook to manage authentication status and role-based access.
 * Returns the session, loading status, and utility functions for checking roles.
 * Can optionally redirect if not authenticated or not authorized by role.
 */
export const useAuth = (options?: {
    redirectTo?: string;
    allowedRoles?: string[];
    redirectIfUnauthorized?: string;
}) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const userRole = session?.user?.role;

    const { redirectTo, allowedRoles, redirectIfUnauthorized } = options || {};

    useEffect(() => {
        if (!isLoading) {
            if (redirectTo && !isAuthenticated) {
                router.push(redirectTo);
            }

            if (isAuthenticated && allowedRoles && redirectIfUnauthorized) {
                if (!userRole || !allowedRoles.includes(userRole)) {
                    router.push(redirectIfUnauthorized);
                }
            }
        }
    }, [isLoading, isAuthenticated, userRole, router, redirectTo, allowedRoles, redirectIfUnauthorized]);

    const hasRole = (roles: string | string[]): boolean => {
        if (!isAuthenticated || !userRole) return false;
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        return rolesArray.includes(userRole);
    };

    return {
        session,
        isLoading,
        isAuthenticated,
        userRole,
        hasRole,
    };
};