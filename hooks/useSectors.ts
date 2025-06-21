import { SectorsCacheKeys } from "@/services/const"
import { sectorService } from "@/services/sectorService"
import { useQuery } from "@tanstack/react-query"

export const useSectors = () => {
  const getSectors = useQuery({
    queryKey: [SectorsCacheKeys.Sectors],
    queryFn: () => sectorService.getAll()
  })

  return {
    getSectors
  }
}