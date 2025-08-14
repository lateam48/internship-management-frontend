import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers";
import applicationService from "@/services/applicationService";
import { apiClient } from "@/lib/axios";
import { ApplicationCacheKeys, ConventionCacheKeys } from "@/services/const";

export const useApplication = (params?: {
  studentId?: number;
  companyId?: number;
  offerId?: number;
}) => {

  const getMyApplications = useQuery({
    queryKey: [ApplicationCacheKeys.Applications, ApplicationCacheKeys.MyApplications],
    queryFn: () => applicationService.getMyApplications(),
    enabled: true,
  });

  const getStudentApplications = useQuery({
    queryKey: [ApplicationCacheKeys.Applications, ApplicationCacheKeys.Student, params?.studentId],
    queryFn: () => applicationService.getApplicationsByStudent(params!.studentId!),
    enabled: !!params?.studentId,
  });

  const getCompanyApplications = useQuery({
    queryKey: [ApplicationCacheKeys.Applications, ApplicationCacheKeys.Company, params?.companyId],
    queryFn: () => applicationService.getApplicationsByCompany(params!.companyId!),
    enabled: !!params?.companyId,
  });

  const getOfferApplications = useQuery({
    queryKey: [ApplicationCacheKeys.Applications, ApplicationCacheKeys.Offer, params?.offerId],
    queryFn: () => applicationService.getApplicationsByOffer(params!.offerId!),
    enabled: !!params?.offerId,
  });

  const downloadBundleMutation = useMutation({
    mutationFn: (applicationId: number) =>
      applicationService.getApplicationBundle(applicationId),
  });

  const createApplication = useMutation({
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
      queryClient.invalidateQueries({ queryKey: [ApplicationCacheKeys.Applications] });
    },
  });

  const updateApplication = useMutation({
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
      queryClient.invalidateQueries({ queryKey: [ApplicationCacheKeys.Applications] });
    },
  });

  const updateApplicationStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      applicationService.updateStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApplicationCacheKeys.Applications] });
    },
  });

  const deleteApplication = useMutation({
    mutationFn: ({ id, studentId }: { id: number; studentId: number }) =>
      applicationService.deleteApplication(id, studentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApplicationCacheKeys.Applications] });
    },
  });

  const createConvention = useMutation({
    mutationFn: async (applicationId: number) => {
      const response = await apiClient.post(`/api/v1/conventions/create-from-application/${applicationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApplicationCacheKeys.Applications] });
      queryClient.invalidateQueries({ queryKey: [ConventionCacheKeys.Conventions] });
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
