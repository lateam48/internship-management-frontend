import { UsersCacheKeys } from "@/services/const"
import { userManagementService } from "@/services/userManagementService"
import { UserRole } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useUsers = (filters?: { role?: UserRole }) => {
  const getUsers = useQuery({
    queryKey: [UsersCacheKeys.Users, filters],
    queryFn: () => userManagementService.getAll(filters?.role)
  })

  return {
    getUsers
  }
}