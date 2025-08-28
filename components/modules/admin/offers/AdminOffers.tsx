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
  const [companyFilter, setCompanyFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const { getInternshipOffers: statsQuery } = useInternshipOffers()
  const { getInternshipOffers: offersQuery } = useInternshipOffers()

  const { getSectors } = useSectors()

  const allOffers = statsQuery.data
  const offers = offersQuery.data
  const sectors = getSectors.data

  const filteredOffers = offers?.filter((offer) => {
    const matchesStatus = statusFilter === "ALL" || offer.status === statusFilter
    const matchesSector = sectorFilter === "ALL" || offer.sector?.name === sectorFilter
    const matchesCompany = companyFilter === "ALL" || offer.companyName === companyFilter
    const matchesSearch = !searchQuery || 
      (offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (offer.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (offer.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)
    
    return matchesStatus && matchesSector && matchesCompany && matchesSearch
  })

  const handleFiltersChange = (filters: { status: OfferStatus | "ALL"; sector: string; company: string; search?: string }) => {
    setStatusFilter(filters.status)
    setSectorFilter(filters.sector)
    setCompanyFilter(filters.company)
    setSearchQuery(filters.search || "")
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminOffersHeader />
      <AdminOffersStats offers={allOffers} />
      <AdminOffersFilters 
        sectors={sectors}
        offers={allOffers}
        onFiltersChange={handleFiltersChange}
      />
      <AdminOffersGrid 
        offers={filteredOffers} 
        isLoading={offersQuery.isLoading}
      />
    </div>
  )
}