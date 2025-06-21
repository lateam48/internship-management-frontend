import { UseMutationResult } from "@tanstack/react-query"
import type { User, RegisterRequest, UpdateUserRequest } from "./index"

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export type CreateUserMutation = UseMutationResult<User, ApiError, { data: RegisterRequest }, unknown>
export type UpdateUserMutation = UseMutationResult<User, ApiError, { id: number; data: UpdateUserRequest }, unknown>
export type DeleteUserMutation = UseMutationResult<unknown, ApiError, number, unknown> 