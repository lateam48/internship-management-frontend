export const UserRoles = {
    ADMIN: "ADMIN",
    COMPANY: "COMPANY",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];


export interface UserResponseData{
  id:number
  username:string
  email:string
  firstName:string
  lastName:string
  role:UserRole
}