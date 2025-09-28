import type { Sector } from './sector';

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

export type NotificationType =
  | "NEW_OFFER"
  | "NEW_APPLICATION"
  | "CONVENTION_VALIDATION"
  | "ADMIN_APPROVAL"
  | "CONVENTION_VALIDATION_REMINDER"
  | "APPLICATION_DECISION_REMINDER"
export type NotificationChannel = "IN_APP" | "EMAIL"
export type NotificationStatus = "UNREAD" | "ARCHIVED"
export type OfferStatus = "ACTIVE" | "INACTIVE" | "COMPLETED" | "ALL"

export interface User {
  id: number
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  sector?: Sector
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  sectorId?: number
}

export interface UpdateUserRequest {
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  sectorId: number
}
export interface AuthResponse {
  token: string
  user: User
}

export interface NotificationRecipient {
  userId: number;
  read: boolean;
  readAt: string;
}

export interface MarkReadRequestDTO {
  notificationIds: number[];
  userId: number;
}

export interface ArchiveNotificationRequestDTO {
  notificationId: number;
  userId: number;
}

export interface NotificationDTO {
  id: number
  subject: string
  content: string
  type: NotificationType
  status: NotificationStatus
  channel: NotificationChannel
  senderId: number
  createdAt: string
  recipients?: NotificationRecipient[]
  read: boolean
}

export interface CreateNotificationDTO {
  type: NotificationType
  channel: NotificationChannel
  subject: string
  senderId: number
  content: string
  targetRole?: UserRole
  sector?: Sector
  userIds?: number[]
}

export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export * from './sector';
export * from './offer';
export * from './convention';
export * from './application';
export * from './user';
export * from './chat';
