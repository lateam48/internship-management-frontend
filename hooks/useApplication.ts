import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import applicationService from "@/services/applicationService";
import { apiClient } from "@/lib/axios";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useApplication = () => {
  const queryClient = useQueryClient();

  const getMyApplications = () => {
    return useQuery({
      queryKey: ["applications", "my-applications"],
      queryFn: () => applicationService.getMyApplications(),
      enabled: true,
    });
  };

  const getStudentApplications = (studentId: number) => {
    return useQuery({
      queryKey: ["applications", "student", studentId],
      queryFn: () => applicationService.getApplicationsByStudent(studentId),
      enabled: !!studentId,
    });
  };

  const getCompanyApplications = (companyId: number) => {
    return useQuery({
      queryKey: ["applications", "company", companyId],
      queryFn: () => applicationService.getApplicationsByCompany(companyId),
      enabled: !!companyId,
    });
  };

  const getOfferApplications = (offerId: number) => {
    return useQuery({
      queryKey: ["applications", "offer", offerId],
      queryFn: () => applicationService.getApplicationsByOffer(offerId),
      enabled: !!offerId,
    });
  };

  const downloadBundleMutation = useMutation({
    mutationFn: (applicationId: number) =>
      applicationService.getApplicationBundle(applicationId),
    onSuccess: () => {
      toast.success("🚀 Téléchargement initié", {
        description: "Le téléchargement du bundle d'application a commencé.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("❌ Erreur de téléchargement", {
        description: error.message || "Échec du téléchargement du bundle d'application.",
      });
    },
  });

  const createApplication = () => {
    return useMutation({
      mutationFn: ({
        studentId,
        offerId,
        cvFile,
        coverLetterFile,
      }: {
        studentId: number;
        offerId: number;
        cvFile: File;
        coverLetterFile: File;
      }) =>
        applicationService.createApplication(
          studentId,
          offerId,
          cvFile,
          coverLetterFile
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
        toast.success("🎉 Application Submitted", {
          description: "Your application was successfully submitted.",
        });
      },

      onError: (error: ApiError) => {
        toast.error("❌ Error", {
          description: error.message || "Failed to submit the application.",
        });
      },
    });
  };

  const updateApplication = () => {
    return useMutation({
      mutationFn: ({
        id,
        studentId,
        offerId,
        cvFile,
        coverLetterFile,
      }: {
        id: number;
        studentId: number;
        offerId: number;
        cvFile: File;
        coverLetterFile: File;
      }) =>
        applicationService.updateApplication(
          id,
          studentId,
          offerId,
          cvFile,
          coverLetterFile
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
        toast.success("✅ Application Updated", {
          description: "The application was successfully updated.",
        });
      },
    });
  };

  const updateApplicationStatus = () => {
    return useMutation({
      mutationFn: ({ id, status }: { id: number; status: string }) =>
        applicationService.updateStatus(id, status),

      onSuccess: (_, { status }) => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
        const statusText = status === "ACCEPTED" ? "accepted" : "rejected";
        const emoji = status === "ACCEPTED" ? "✅" : "❌";
        toast.success(`${emoji} Application ${statusText}`, {
          description: `The application status has been updated to ${status}.`,
        });
      },
    });
  };

  const deleteApplication = () => {
    return useMutation({
      mutationFn: ({ id, studentId }: { id: number; studentId: number }) =>
        applicationService.deleteApplication(id, studentId),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
        toast.success("🗑️ Application Deleted", {
          description: "The application has been successfully deleted.",
        });
      },
    });
  };

   const createConvention = () =>
    useMutation({
      mutationFn: async (applicationId: number) => {
        const response = await apiClient.post(`/api/v1/conventions/create-from-application/${applicationId}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
        queryClient.invalidateQueries({ queryKey: ["conventions"] });
        toast.success("✅ Convention créée", {
          description: "La convention a été créée avec succès.",
        });
      },
      onError: (error: ApiError) => {
        toast.error("❌ Erreur", {
          description: error.message || "Échec de la création de la convention.",
        });
      },
    });



  return {
    deleteApplication,
    updateApplicationStatus,
    updateApplication,
    createApplication,
    downloadApplicationBundle: downloadBundleMutation,
    getOfferApplications,
    getCompanyApplications,
    getStudentApplications,
    getMyApplications,
    createConvention,
  };
};
