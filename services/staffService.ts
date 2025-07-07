import { apiClient } from "@/lib/axios"
import { User, UserRole } from "@/types"

const BASE_URL = "/staff"

export interface UpdateStaffMeRequest {
  username: string;
  firstName: string;
  lastName: string;
  sectorId: number;
}

export const staffService = {
  getAll: async () => {
    const response = await apiClient.get<User[]>(`${BASE_URL}`)
    return response.data
  },
  getByRole: async (role: UserRole) => {
    const response = await apiClient.get<User[]>(`${BASE_URL}/${role}`)
    return response.data
  },
  updateMe: async (data: UpdateStaffMeRequest) => {
    const response = await apiClient.put(`${BASE_URL}/me`, data);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get<User>(`${BASE_URL}/me`);
    return response.data;
  },
}