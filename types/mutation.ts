import { UseMutationResult } from "@tanstack/react-query"
import { Sector } from "./index"

export type CreateSectorMutation = UseMutationResult<Sector, Error, { data: string }, unknown>
export type UpdateSectorMutation = UseMutationResult<Sector, Error, { id: number; data: string }, unknown>
export type DeleteSectorMutation = UseMutationResult<unknown, Error, number, unknown> 