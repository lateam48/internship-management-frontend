import { useQuery } from "@tanstack/react-query";
import applicationService from "@/services/applicationService";
import { ApplicationCacheKeys } from "@/services/const";

export const useApplications = () => {
  const getAllApplications = useQuery({
    queryKey: [ApplicationCacheKeys.Applications, ApplicationCacheKeys.All],
    queryFn: () => applicationService.getAllApplications(),
  });

  return {
    getAllApplications,
  };
};
