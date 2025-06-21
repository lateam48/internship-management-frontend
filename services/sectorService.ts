import { apiClient } from '@/lib/axios'
import { Sector } from '@/types'

const BASE_URL = '/sectors'

export const sectorService = {
  getAll: async () => {
    const response = await apiClient.get<Sector[]>(`${BASE_URL}`)
    return response.data
  },
  getById: async (id: number) => {
    const response = await apiClient.get<Sector>(`${BASE_URL}/${id}`)
    return response.data
  },
  create: async (name: string) => {
    const response = await apiClient.post<Sector>(`${BASE_URL}`, { name: name })
    return response.data
  },
  update: async (id: number, name: string) => {
    const response = await apiClient.put<Sector>(`${BASE_URL}/${id}`, { name: name })
    return response.data
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`)
    return response.data
  },
}