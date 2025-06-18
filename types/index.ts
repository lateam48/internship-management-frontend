export const UserRoles = {
    ADMIN: "admin",
    TEACHER: "teacher",
    STUDENT: "student",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];