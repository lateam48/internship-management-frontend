import { UseMutationResult } from "@tanstack/react-query"

export type ConventionStatus =
  | "PENDING"
  | "VALIDATED_BY_TEACHER"
  | "APPROVED_BY_ADMIN"
  | "REJECTED_BY_TEACHER"
  | "REJECTED_BY_ADMIN"

export interface ConventionResponseDTO {
  id: number
  title: string
  description: string
  location: string
  skills: string[]
  length: number
  companyName: string
  studentName: string
  startDate: string
  endDate: string
  status: ConventionStatus
  pdfPath: string
  signedPdfPath: string
  applicationId: number
  companyId: number
  studentId: number
}

export interface UpdateConventionByCompanyDTO {
  id: number
  title: string
  description: string
  location: string
  skills: string[]
  length: number
  companyId: number
  studentId: number
  startDate: string
  endDate: string
}

export type CreateConventionFromApplicationMutation = UseMutationResult<ConventionResponseDTO, Error, number, unknown>
export type ValidateConventionByTeacherMutation = UseMutationResult<unknown, Error, number, unknown>
export type RejectConventionByTeacherMutation = UseMutationResult<unknown, Error, { id: number; reason: string }, unknown>
export type ApproveConventionByAdminMutation = UseMutationResult<unknown, Error, number, unknown>
export type RejectConventionByAdminMutation = UseMutationResult<unknown, Error, { id: number; reason: string }, unknown>
export type UpdateConventionByCompanyMutation = UseMutationResult<ConventionResponseDTO, Error, { id: number; companyId: number; data: Record<string, unknown> }, unknown>
export type DownloadConventionPdfMutation = UseMutationResult<unknown, Error, number, unknown> 