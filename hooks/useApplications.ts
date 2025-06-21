import { useQuery } from "@tanstack/react-query";
import applicationService from "@/services/applicationService";

export const useApplications = () => {
  const getAllApplications = () => {
    return useQuery({
      queryKey: ["applications", "all"],
      queryFn: () => applicationService.getAllApplications(),
    });
  };

  return {
    getAllApplications,
  };
};
