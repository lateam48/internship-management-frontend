import { useQuery } from '@tanstack/react-query';
import { OfferStatus } from '@/types';
import { internshipOfferService } from '@/services/offerService';
import { InternshipOffersCacheKeys } from '@/services/const';
export const useInternshipOffers = (filters?: {
  sector?: string
  location?: string
  length?: number
  status?: OfferStatus
  companyId?: number
}) => {
  const getInternshipOffers = useQuery({
    queryKey: [InternshipOffersCacheKeys.InternshipOffers,filters],
    queryFn: () => internshipOfferService.filter(filters)
  })

  return {
    getInternshipOffers
  }
}