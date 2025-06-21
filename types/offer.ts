import { UseMutationResult } from "@tanstack/react-query"

export interface GetInternshipOfferResponseDTO {
  id: number
  title: string
  description: string
  sector: import('./sector').Sector
  location: string
  skills: string[]
  length: number
  companyName: string
  companyId: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateInternshipOfferRequestDTO {
  title: string
  description: string
  sector: import('./sector').Sector
  location: string
  skills: string[]
  length: number
  companyId: number
}

export type CreateOfferMutation = UseMutationResult<GetInternshipOfferResponseDTO, Error, { data: CreateInternshipOfferRequestDTO }, unknown>
export type UpdateOfferMutation = UseMutationResult<GetInternshipOfferResponseDTO, Error, { id: number; data: CreateInternshipOfferRequestDTO }, unknown>
export type ActivateOfferMutation = UseMutationResult<unknown, Error, number, unknown>
export type InactivateOfferMutation = UseMutationResult<unknown, Error, number, unknown>
export type CompleteOfferMutation = UseMutationResult<unknown, Error, number, unknown> 