import { useQuery, useMutation } from "@tanstack/react-query"
import { queryClient } from "@/providers"
import { toast } from "sonner"
import conventionService from "@/services/conventionService"
import { CreateConventionFormSchema } from "@/types";
import type { ApiError } from "@/types";
import { ConventionCacheKeys, ApplicationCacheKeys } from "@/services/const";

export const useAllConventions = () => {
  return useQuery({
    queryKey: [ConventionCacheKeys.Conventions],
    queryFn: () => conventionService.getAllConventions(),
    enabled: true,
  })
}

export const useConventionDetails = (id: number) => {
  return useQuery({
    queryKey: [ConventionCacheKeys.Convention, id],
    queryFn: () => conventionService.getConventionById(id),
    enabled: !!id,
  })
}

export const useCompanyConventions = (companyId: number) => {
  return useQuery({
    queryKey: [ConventionCacheKeys.Conventions, ConventionCacheKeys.Company, companyId],
    queryFn: () => conventionService.getConventionsByCompany(companyId),
    enabled: !!companyId && companyId > 0,
    retry: (failureCount, error: ApiError) => {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    }
  })
}

export const useTeacherConventions = (teacherId: number) => {
  return useQuery({
    queryKey: [ConventionCacheKeys.Conventions, ConventionCacheKeys.Teacher, teacherId],
    queryFn: () => conventionService.getConventionsByTeacher(teacherId),
    enabled: !!teacherId && teacherId > 0,
    retry: (failureCount, error: ApiError) => {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    }
  })
}

export const useCheckConventionExists = (applicationId: number) => {
  return useQuery({
    queryKey: [ConventionCacheKeys.ConventionExists, applicationId],
    queryFn: () => conventionService.checkConventionExistsForApplication(applicationId),
    enabled: !!applicationId,
  })
}

export const useCheckPdfAvailability = (conventionId: number) => {
  return useQuery({
    queryKey: [ConventionCacheKeys.ConventionPdf, conventionId],
    queryFn: () => conventionService.checkPdfAvailability(conventionId),
    enabled: !!conventionId,
  })
}

export const useCreateConventionFromApplication = () => {
  return useMutation({
    mutationFn: ({ applicationId, conventionData }: { applicationId: number; conventionData: CreateConventionFormSchema }) =>
      conventionService.createConventionFromApplication(applicationId, conventionData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] })
      queryClient.invalidateQueries({ queryKey: [ApplicationCacheKeys.Applications] })
      
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

export const useValidateConventionByTeacher = () => {
  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.validateConventionByTeacher(conventionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] })
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

export const useRejectConventionByTeacher = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      conventionService.rejectConventionByTeacher(id, { reason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] })
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

export const useApproveConventionByAdmin = () => {
  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.approveConventionByAdmin(conventionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] })
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

export const useRejectConventionByAdmin = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      conventionService.rejectConventionByAdmin(id, { reason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] })
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

export const useUpdateConventionByCompany = () => {
  return useMutation({
    mutationFn: ({ id, companyId, data }: { id: number; companyId: number; data: Record<string, unknown> }) =>
      conventionService.updateConventionByCompany(id, companyId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] })
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

export const useDownloadConventionPdf = () => {
  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.downloadConventionPdf(conventionId),

    onSuccess: (blob, conventionId) => {
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

export const useUploadSignedPdf = () => {
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      conventionService.uploadSignedPdf(id, file),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] })
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