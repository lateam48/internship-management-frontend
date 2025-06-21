import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import conventionService from "@/services/conventionService"

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
    retry: (failureCount, error: any) => {
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
    retry: (failureCount, error: any) => {
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: number) =>
      conventionService.createConventionFromApplication(applicationId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      
      toast({
        title: "📋 Convention créée",
        description: `La convention "${data.title}" a été générée avec succès.`,
      })
    },

    onError: (error: any) => {
      let errorMessage = "Impossible de créer la convention"
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "❌ Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

// Hook pour valider une convention par l'enseignant
export const useValidateConventionByTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.validateConventionByTeacher(conventionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast({
        title: "✅ Convention validée",
        description: "La convention a été validée par l'enseignant.",
      })
    },

    onError: (error: any) => {
      let errorMessage = "Impossible de valider la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à valider cette convention. Vérifiez que vous êtes bien l'enseignant assigné à cette convention."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "❌ Erreur de validation",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

// Hook pour rejeter une convention par l'enseignant
export const useRejectConventionByTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      conventionService.rejectConventionByTeacher(id, { reason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast({
        title: "❌ Convention rejetée",
        description: "La convention a été rejetée par l'enseignant.",
      })
    },

    onError: (error: any) => {
      let errorMessage = "Impossible de rejeter la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à rejeter cette convention. Vérifiez que vous êtes bien l'enseignant assigné à cette convention."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "❌ Erreur de rejet",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

// Hook pour approuver une convention par l'admin
export const useApproveConventionByAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.approveConventionByAdmin(conventionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast({
        title: "✅ Convention approuvée",
        description: "La convention a été approuvée par l'administrateur.",
      })
    },

    onError: (error: any) => {
      let errorMessage = "Impossible d'approuver la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à approuver cette convention."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "❌ Erreur d'approbation",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

// Hook pour rejeter une convention par l'admin
export const useRejectConventionByAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      conventionService.rejectConventionByAdmin(id, { reason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast({
        title: "❌ Convention rejetée",
        description: "La convention a été rejetée par l'administrateur.",
      })
    },

    onError: (error: any) => {
      let errorMessage = "Impossible de rejeter la convention"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à rejeter cette convention."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "❌ Erreur de rejet",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

// Hook pour mettre à jour une convention par l'entreprise
export const useUpdateConventionByCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, companyId, data }: { id: number; companyId: number; data: any }) =>
      conventionService.updateConventionByCompany(id, companyId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast({
        title: "✅ Convention mise à jour",
        description: "La convention a été mise à jour avec succès.",
      })
    },

    onError: (error: any) => {
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de mettre à jour la convention",
        variant: "destructive",
      })
    },
  })
}

// Hook pour télécharger le PDF d'une convention
export const useDownloadConventionPdf = () => {
  return useMutation({
    mutationFn: (conventionId: number) =>
      conventionService.downloadConventionPdf(conventionId),

    onMutate: () => {
      toast({
        title: "📄 Téléchargement en cours",
        description: "Préparation du PDF...",
      })
    },

    onSuccess: (blob, conventionId) => {
      try {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `convention_${conventionId}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "📄 PDF téléchargé",
          description: "Le PDF de la convention a été téléchargé avec succès.",
        })
      } catch (downloadError) {
        console.error("Erreur lors du téléchargement:", downloadError)
        toast({
          title: "❌ Erreur de téléchargement",
          description: "Impossible de télécharger le fichier PDF",
          variant: "destructive",
        })
      }
    },

    onError: (error: any) => {
      let errorMessage = "Impossible de télécharger le PDF"
      
      if (error.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à télécharger cette convention."
      } else if (error.response?.status === 404) {
        errorMessage = "Convention non trouvée ou PDF non disponible."
      } else if (error.response?.status === 500) {
        errorMessage = "Erreur serveur lors de la génération du PDF."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "❌ Erreur de téléchargement",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })
}

// Hook pour uploader un PDF signé
export const useUploadSignedPdf = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      conventionService.uploadSignedPdf(id, file),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conventions"] })
      toast({
        title: "📄 PDF signé uploadé",
        description: "Le PDF signé a été uploadé avec succès.",
      })
    },

    onError: (error: any) => {
      toast({
        title: "❌ Erreur d'upload",
        description: error.message || "Impossible d'uploader le PDF signé",
        variant: "destructive",
      })
    },
  })
}