import { useQuery, useMutation } from "@tanstack/react-query"
import { queryClient } from "@/providers"
import { toast } from "sonner"
import conventionService from "@/services/conventionService"
import { CreateConventionFormSchema } from "@/types";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Hook pour récupérer toutes les conventions
export const useAllConventions = () => {
  return useQuery({
    queryKey: ["conventions"],
    queryFn: () => conventionService.getAllConventions(),
    enabled: true,
  })
}

// Hook pour les détails d'une convention
export const useConventionDetails = (id: number) => {
  return useQuery({
    queryKey: ["convention", id],
    queryFn: () => conventionService.getConventionById(id),
    enabled: !!id,
  })
}

// Hook pour les conventions d'une entreprise
export const useCompanyConventions = (companyId: number) => {
  return useQuery({
    queryKey: ["conventions", "company", companyId],
    queryFn: () => conventionService.getConventionsByCompany(companyId),
    enabled: !!companyId && companyId > 0,
    retry: (failureCount, error: ApiError) => {
      // Ne pas réessayer si c'est une erreur d'autorisation
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    }
  })
}

// Hook pour les conventions d'un enseignant
export const useTeacherConventions = (teacherId: number) => {
  return useQuery({
    queryKey: ["conventions", "teacher", teacherId],
    queryFn: () => conventionService.getConventionsByTeacher(teacherId),
    enabled: !!teacherId && teacherId > 0,
    retry: (failureCount, error: ApiError) => {
      // Ne pas réessayer si c'est une erreur d'autorisation
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    }
  })
}

// Hook pour vérifier l'existence d'une convention
export const useCheckConventionExists = (applicationId: number) => {
  return useQuery({
    queryKey: ["convention-exists", applicationId],
    queryFn: () => conventionService.checkConventionExistsForApplication(applicationId),
    enabled: !!applicationId,
  })
}

// Hook pour vérifier la disponibilité du PDF
export const useCheckPdfAvailability = (conventionId: number) => {
  return useQuery({
    queryKey: ["convention-pdf", conventionId],
    queryFn: () => conventionService.checkPdfAvailability(conventionId),
    enabled: !!conventionId,
  })
}

// Hook pour créer une convention à partir d'une application
export const useCreateConventionFromApplication = () => {
  return useMutation({
    mutationFn: ({ applicationId, conventionData }: { applicationId: number; conventionData: CreateConventionFormSchema }) =>
      conventionService.createConventionFromApplication(applicationId, conventionData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      
      toast.success("📋 Convention créée", {
        description: `La convention "${data.title}" a été générée avec succès.`,
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible de créer la convention"
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("❌ Erreur", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour valider une convention par l'enseignant
export const useValidateConventionByTeacher = () => {
  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.validateConventionByTeacher(conventionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast.success("✅ Convention validée", {
        description: "La convention a été validée par l'enseignant.",
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible de valider la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à valider cette convention. Vérifiez que vous êtes bien l'enseignant assigné à cette convention."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("❌ Erreur de validation", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour rejeter une convention par l'enseignant
export const useRejectConventionByTeacher = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      conventionService.rejectConventionByTeacher(id, { reason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast.success("❌ Convention rejetée", {
        description: "La convention a été rejetée par l'enseignant.",
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible de rejeter la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à rejeter cette convention. Vérifiez que vous êtes bien l'enseignant assigné à cette convention."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("❌ Erreur de rejet", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour approuver une convention par l'admin
export const useApproveConventionByAdmin = () => {
  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.approveConventionByAdmin(conventionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast.success("✅ Convention approuvée", {
        description: "La convention a été approuvée par l'administrateur.",
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible d'approuver la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à approuver cette convention. Vérifiez que vous avez les droits d'administrateur."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("❌ Erreur d'approbation", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour rejeter une convention par l'admin
export const useRejectConventionByAdmin = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      conventionService.rejectConventionByAdmin(id, { reason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast.success("❌ Convention rejetée", {
        description: "La convention a été rejetée par l'administrateur.",
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible de rejeter la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à rejeter cette convention. Vérifiez que vous avez les droits d'administrateur."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("❌ Erreur de rejet", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour mettre à jour une convention par l'entreprise
export const useUpdateConventionByCompany = () => {
  return useMutation({
    mutationFn: ({ id, companyId, data }: { id: number; companyId: number; data: Record<string, unknown> }) =>
      conventionService.updateConventionByCompany(id, companyId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast.success("✅ Convention mise à jour", {
        description: "La convention a été mise à jour par l'entreprise.",
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible de mettre à jour la convention"
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("❌ Erreur de mise à jour", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour télécharger le PDF d'une convention
export const useDownloadConventionPdf = () => {
  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.downloadConventionPdf(conventionId),

    onSuccess: (blob, conventionId) => {
      // Création du lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `convention_${conventionId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success("📄 PDF téléchargé", {
        description: "Le PDF de la convention a été téléchargé avec succès.",
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible de télécharger le PDF"
      if (error.response?.status === 404) {
        errorMessage = "Le PDF de cette convention n'est pas encore disponible."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      toast.error("❌ Erreur de téléchargement", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour uploader le PDF signé
export const useUploadSignedPdf = () => {
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      conventionService.uploadSignedPdf(id, file),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast.success("📄 PDF signé uploadé", {
        description: "Le PDF signé a été uploadé avec succès.",
      })
    },

    onError: (error: ApiError) => {
      let errorMessage = "Impossible d'uploader le PDF signé"
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("❌ Erreur d'upload", {
        description: errorMessage,
      })
    },
  })
}

// Hook pour régénérer le PDF d'une convention
export const useRegenerateConventionPdf = () => {
  return useMutation({
    mutationFn: (id: number) => conventionService.regenerateConventionPdf(id),
    onSuccess: () => {
      toast.success("PDF régénéré", { description: "Le PDF a été régénéré avec succès." })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur lors de la régénération du PDF", { description: error.message })
    }
  })
}