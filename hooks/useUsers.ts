import { UsersCacheKeys } from "@/services/const"
import { userManagementService } from "@/services/userManagementService"
import { useQuery } from "@tanstack/react-query"
import { UserRole, User} from '@/types';


export const useUsers = (filters?: { role?: UserRole }) => {
  const getUsers = useQuery({
    queryKey: [UsersCacheKeys.Users, filters],
    queryFn: () => userManagementService.getAll(filters?.role)
  })

  return {
    getUsers
  }
}

export const useStaff = (filters?: { role?: UserRole }) => {
  const getStaff = useQuery({
      queryKey: [UsersCacheKeys.Staff, filters],
      queryFn: () => userManagementService.getAllStaff(filters?.role)
  })

  return {
      getStaff
  }
}

export const useStaffMember = ({ staffId }: {
  staffId?: User['id']
}) => {
  const getStaffMember = useQuery({
      queryKey: [UsersCacheKeys.Staff, staffId],
      queryFn: () =>
        userManagementService.getStaffById(staffId as User['id']),
      enabled: !!staffId
  })

  return {
      getStaffMember
  }
}