import { apiClient } from '@/lib/axios'
import { CreateInternshipOfferRequestDTO, GetInternshipOfferResponseDTO, OfferStatus } from '@/types'

const BASE_URL = '/offers'

export const internshipOfferService = {
  getById: async (id: number) => {
    const response = await apiClient.get<GetInternshipOfferResponseDTO>(`${BASE_URL}/${id}`)
    return response.data
  },

  create: async (data: CreateInternshipOfferRequestDTO) => {
    const response = await apiClient.post<GetInternshipOfferResponseDTO>(`${BASE_URL}`, data)
    return response.data
  },

  update: async (id: number, data: CreateInternshipOfferRequestDTO) => {
    const response = await apiClient.put<GetInternshipOfferResponseDTO>(`${BASE_URL}?id=${id}`, data)
    return response.data
  },

  activate: async (id: number) => {
    const response = await apiClient.post<GetInternshipOfferResponseDTO>(`${BASE_URL}/${id}/activate`)
    return response.data
  },

  inactivate: async (id: number) => {
    const response = await apiClient.post<GetInternshipOfferResponseDTO>(`${BASE_URL}/${id}/inactivate`)
    return response.data
  },

  complete: async (id: number) => {
    const response = await apiClient.post<GetInternshipOfferResponseDTO>(`${BASE_URL}/${id}/complete`)
    return response.data
  },

  filter: async (filters?: {
    sector?: string
    location?: string
    length?: number
    status?: OfferStatus
    companyId?: number
  }) => {
    const response = await apiClient.get<GetInternshipOfferResponseDTO[]>(`${BASE_URL}`, { params: filters })
    return response.data
  }
}