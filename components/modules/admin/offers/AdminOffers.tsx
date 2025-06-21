"use client"

import { useState } from "react"
import { useInternshipOffers } from "@/hooks/useInternshipOffers"
import { useSectors } from "@/hooks/useSectors"
import { 
  AdminOffersHeader,
  AdminOffersStats,
  AdminOffersFilters,
  AdminOffersGrid
} from "@/components/modules/admin/offers"
import { OfferStatus } from "@/types"

export function AdminOffers() {
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "ALL">("ALL")
  const [sectorFilter, setSectorFilter] = useState("ALL")

  // Utilisation des hooks modifiés
  const { getInternshipOffers: statsQuery } = useInternshipOffers()
  const { getInternshipOffers: offersQuery } = useInternshipOffers({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    sector: sectorFilter === "ALL" ? undefined : sectorFilter
  })

  const { getSectors } = useSectors()

  // Récupération des données
  const allOffers = statsQuery.data
  const filteredOffers = offersQuery.data
  const sectors = getSectors.data

  const handleFiltersChange = (filters: { status: OfferStatus | "ALL"; sector: string }) => {
    setStatusFilter(filters.status)
    setSectorFilter(filters.sector)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminOffersHeader />
      <AdminOffersStats offers={allOffers} />
      <AdminOffersFilters 
        sectors={sectors} 
        onFiltersChange={handleFiltersChange}
      />
      <AdminOffersGrid 
        offers={filteredOffers} 
        isLoading={offersQuery.isLoading}
      />
    </div>
  )
}