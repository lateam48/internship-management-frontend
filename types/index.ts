
export const UserRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];