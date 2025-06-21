import { UseMutationResult } from "@tanstack/react-query"

export interface Sector {
  id: number
  name: string
}

export type CreateSectorMutation = UseMutationResult<Sector, Error, { data: string }, unknown>
export type UpdateSectorMutation = UseMutationResult<Sector, Error, { id: number; data: string }, unknown>
export type DeleteSectorMutation = UseMutationResult<unknown, Error, number, unknown> 