"use client"

import { useState } from "react"
import { useSectors } from "@/hooks/useSectors"
import { useInternshipOffers } from "@/hooks/useInternshipOffers"
import { StudentOffersHeader, StudentOffersFilters, StudentOffersGrid } from "@/components/modules/student/offers"
import type { OfferStatus } from "@/types/offer"

export function StudentOffers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [lengthFilter, setLengthFilter] = useState("all")

  const { getSectors } = useSectors()
  const sectors = getSectors.data
  const sectorsLoading = getSectors.isLoading

  const filters = {
    location: locationFilter !== "all" ? locationFilter : undefined,
    sector: sectorFilter !== "all" ? sectorFilter : undefined,
    length: lengthFilter !== "all" ? Number.parseInt(lengthFilter) : undefined,
    companyId: undefined,
    status: "ACTIVE" as OfferStatus
  }

  const { getInternshipOffers } = useInternshipOffers(filters)
  const offers = getInternshipOffers.data
  const isLoading = getInternshipOffers.isLoading
  const error = getInternshipOffers.error
  const refetch = getInternshipOffers.refetch

  const filteredOffers = offers?.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const cameroonianCities = [
    "Yaoundé, Centre", "Douala, Littoral", "Bamenda, Nord-Ouest", "Bafoussam, Ouest",
    "Garoua, Nord", "Maroua, Extrême-Nord", "Ngaoundéré, Adamaoua", "Bertoua, Est",
    "Ebolowa, Sud", "Kribi, Sud", "Limbé, Sud-Ouest", "Buéa, Sud-Ouest",
  ]

  const resetFilters = () => {
    setSearchTerm("")
    setLocationFilter("all")
    setSectorFilter("all")
    setLengthFilter("all")
  }

  const hasActiveFilters = Boolean(
    searchTerm || locationFilter !== "all" || sectorFilter !== "all" || lengthFilter !== "all"
  )

  return (
    <div className="space-y-6">
      <StudentOffersHeader />
      <StudentOffersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        sectorFilter={sectorFilter}
        setSectorFilter={setSectorFilter}
        lengthFilter={lengthFilter}
        setLengthFilter={setLengthFilter}
        sectors={sectors}
        sectorsLoading={sectorsLoading}
        cameroonianCities={cameroonianCities}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        error={error}
        refetch={refetch}
        filteredCount={filteredOffers?.length ?? 0}
      />
      <StudentOffersGrid
        offers={filteredOffers}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
      />
    </div>
  )
} 