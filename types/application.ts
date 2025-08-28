import {z} from "zod"
import { UseMutationResult } from "@tanstack/react-query"

export type ApplicationStatus = "ACCEPTED" | "PENDING" | "REJECTED"

export interface ApplicationResponseDTO {
  id: number
  firstName: string
  lastName: string
  offerTitle: string
  status: ApplicationStatus
  applicationDate: string
  offerId: number
  studentId: number
}

export interface CreateApplicationDTO {
  offerId: number
  studentId: number
  coverLetter: string
  cvFile?: File
}

export interface UpdateApplicationStatusDTO {
  id: number
  status: ApplicationStatus
}

export interface CreateConventionFormData {
  title: string
  description: string
  startDate: Date | undefined
  endDate: Date | undefined
  companyName: string
  companyAddress: string
  supervisorName: string
  supervisorEmail: string
  objectives: string
  weeklyHours: string
}

export const createConventionFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  startDate: z.date({ required_error: "La date de début est requise" }),
  endDate: z.date({ required_error: "La date de fin est requise" }),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  companyAddress: z.string().min(1, "L'adresse de l'entreprise est requise"),
  supervisorName: z.string().min(1, "Le nom du superviseur est requis"),
  supervisorEmail: z.string().email("Email invalide"),
  objectives: z.string().min(1, "Les objectifs sont requis"),
  weeklyHours: z.string().min(1, "Les heures hebdomadaires sont requises"),
})

export type CreateConventionFormSchema = z.infer<typeof createConventionFormSchema>

export type UpdateApplicationStatusMutation = UseMutationResult<
  unknown,
  Error,
  UpdateApplicationStatusDTO,
  unknown
>

export type CreateConventionFromApplicationMutation = UseMutationResult<
  unknown,
  Error,
  number,
  unknown
>

export type DownloadApplicationBundleMutation = UseMutationResult<
  unknown,
  Error,
  number,
  unknown
> 