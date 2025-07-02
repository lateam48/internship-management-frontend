import { apiClient } from "@/lib/axios"
import { ConventionResponseDTO, CreateConventionFormSchema } from "@/types"

const BASE_URL = "/conventions"

const getAllConventions = async (): Promise<ConventionResponseDTO[]> => {
  const response = await apiClient.get<ConventionResponseDTO[]>(BASE_URL)
  return response.data
}

// Méthode pour récupérer les conventions par enseignant
const getConventionsByTeacher = async (teacherId: number): Promise<ConventionResponseDTO[]> => {
  const response = await apiClient.get<ConventionResponseDTO[]>(`${BASE_URL}/teacher/${teacherId}`)
  return response.data
}

// Méthode pour récupérer les conventions par entreprise
const getConventionsByCompany = async (companyId: number): Promise<ConventionResponseDTO[]> => {
  const response = await apiClient.get<ConventionResponseDTO[]>(`${BASE_URL}/company/${companyId}`)
  return response.data
}

const getConventionById = async (id: number): Promise<ConventionResponseDTO> => {
  const response = await apiClient.get<ConventionResponseDTO>(`${BASE_URL}/${id}`)
  return response.data
}

const checkConventionExistsForApplication = async (applicationId: number): Promise<boolean> => {
  try {
    const response = await apiClient.get<ConventionResponseDTO[]>(BASE_URL)
    return response.data.some(convention => convention.applicationId === applicationId)
  } catch {
    return false
  }
}

const createConventionFromApplication = async (
  applicationId: number,
  conventionData: CreateConventionFormSchema
): Promise<ConventionResponseDTO> => {
  const response = await apiClient.post<ConventionResponseDTO>(
    `${BASE_URL}/create-from-application/${applicationId}`,
    conventionData
  )
  return response.data
}

const validateConventionByTeacher = async (id: number): Promise<ConventionResponseDTO> => {
  const response = await apiClient.put<ConventionResponseDTO>(
    `${BASE_URL}/${id}/validate-by-teacher`
  )
  return response.data
}

const rejectConventionByTeacher = async (
  id: number,
  reason: Record<string, string>
): Promise<ConventionResponseDTO> => {
  const response = await apiClient.put<ConventionResponseDTO>(
    `${BASE_URL}/${id}/reject-by-teacher`,
    reason
  )
  return response.data
}

const approveConventionByAdmin = async (id: number): Promise<ConventionResponseDTO> => {
  const response = await apiClient.put<ConventionResponseDTO>(
    `${BASE_URL}/${id}/approve-by-admin`
  )
  return response.data
}

const rejectConventionByAdmin = async (
  id: number,
  reason: Record<string, string>
): Promise<ConventionResponseDTO> => {
  const response = await apiClient.put<ConventionResponseDTO>(
    `${BASE_URL}/${id}/reject-by-admin`,
    reason
  )
  return response.data
}

const updateConventionByCompany = async (
  id: number,
  companyId: number,
  data: Record<string, unknown>
): Promise<ConventionResponseDTO> => {
  const response = await apiClient.put<ConventionResponseDTO>(
    `${BASE_URL}/${id}/update-by-company/${companyId}`,
    data
  )
  return response.data
}

const downloadConventionPdf = async (id: number): Promise<Blob> => {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/${id}/download-pdf`,
      { 
        responseType: "blob",
        headers: {
          'Accept': '*/*'
        }
      }
    )
    return response.data
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: { status: number; data: unknown } }
      const status = err.response.status
      let errorMessage = "Erreur inconnue du serveur"
      
      try {
        if (err.response.data instanceof Blob) {
          const text = await err.response.data.text()
          errorMessage = text ?? `Erreur ${status}`
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data
        } else if (
          typeof err.response.data === 'object' &&
          err.response.data !== null &&
          'message' in err.response.data &&
          typeof (err.response.data as { message?: string }).message === 'string'
        ) {
          errorMessage = (err.response.data as { message: string }).message
        }
      } catch {}

      if (status === 500) {
        throw new Error(`Le serveur a rencontré une erreur lors de la génération du PDF. Détails: ${errorMessage}`)
      } else if (status === 404) {
        throw new Error("Convention non trouvée ou PDF non disponible")
      } else {
        throw new Error(`Erreur ${status}: ${errorMessage}`)
      }
    }

    throw new Error("Erreur de connexion. Vérifiez votre connexion internet.")
  }
}

const checkPdfAvailability = async (id: number): Promise<boolean> => {
  try {
    const convention = await getConventionById(id)
    return !!(convention.pdfPath && convention.pdfPath !== "")
  } catch {
    return false
  }
}

const uploadSignedPdf = async (id: number, file: File): Promise<ConventionResponseDTO> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await apiClient.post<ConventionResponseDTO>(
    `${BASE_URL}/${id}/upload-signed-pdf`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )
  return response.data
}

const regenerateConventionPdf = async (id: number): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${id}/regenerate-pdf`)
}

export default {
  getAllConventions,
  getConventionsByTeacher, // Ajouté
  getConventionsByCompany, // Ajouté
  getConventionById,
  checkConventionExistsForApplication,
  createConventionFromApplication,
  validateConventionByTeacher,
  rejectConventionByTeacher,
  approveConventionByAdmin,
  rejectConventionByAdmin,
  updateConventionByCompany,
  downloadConventionPdf,
  checkPdfAvailability,
  uploadSignedPdf,
  regenerateConventionPdf,
}