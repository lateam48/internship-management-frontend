import { useMutation, useQuery } from '@tanstack/react-query';
import { Sector } from '../types/index';
import { sectorService } from '@/services/sectorService';
import { queryClient } from '@/providers';
import { SectorsCacheKeys } from '@/services/const';
export const useSector = ({ sectorId }: {
  sectorId?: Sector['id']
}) => {
  const createSector = useMutation({
    mutationFn: ({ data }: { data: string }) =>
      sectorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SectorsCacheKeys.Sectors]
      })
    }
  })

  const getSector = useQuery({
    queryKey: [SectorsCacheKeys.Sectors, sectorId],
    queryFn: () =>
      sectorService.getById(sectorId as Sector['id']),
    enabled: !!sectorId
  })

  const updateSector = useMutation({
    mutationFn: ({ id, data }: { id: Sector['id']; data: string }) =>
      sectorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SectorsCacheKeys.Sectors]
      })
    }
  })

  const deleteSector = useMutation({
    mutationFn: (sectorId: Sector['id']) => sectorService.delete(sectorId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [SectorsCacheKeys.Sectors]
      })
  })

  return {
    createSector,
    getSector,
    updateSector,
    deleteSector
  }
}