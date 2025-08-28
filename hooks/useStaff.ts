"use client"

import { useQuery, useMutation } from '@tanstack/react-query';
import { UserRole } from '@/types';
import { staffService, UpdateStaffMeRequest } from '@/services/staffService';
import { StaffCacheKeys } from '@/services/const';

export const useStaff = (role?: UserRole) => {
  const getStaff = useQuery({
    queryKey: [StaffCacheKeys.Staff, role],
    queryFn: () => role ? staffService.getByRole(role) : staffService.getAll(),
  });

  return {
    getStaff,
  };
};

export const useUpdateStaffMe = () => {
  return useMutation({
    mutationFn: (data: UpdateStaffMeRequest) => staffService.updateMe(data),
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: [StaffCacheKeys.Me],
    queryFn: staffService.getMe,
  });
}; 