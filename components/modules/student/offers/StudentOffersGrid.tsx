"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/global/empty-state"
import { Search, Briefcase } from "lucide-react"
import { StudentOffersCard } from "./StudentOffersCard"
import { GetInternshipOfferResponseDTO } from "@/types"

export function StudentOffersGrid({
  offers,
  isLoading,
  error,
  refetch,
  hasActiveFilters,
  resetFilters,
}: {
  offers: GetInternshipOfferResponseDTO[] | undefined
  isLoading: boolean
  error: unknown
  refetch: () => void
  hasActiveFilters: boolean
  resetFilters: () => void
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 p-4 rounded-lg border bg-card">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Erreur de chargement"
        description="Impossible de charger les offres de stage. Vérifiez votre connexion internet et réessayez."
        action={{ label: "Réessayer", onClick: refetch }}
      />
    )
  }
  if (!offers || offers.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={hasActiveFilters ? "Aucune offre trouvée" : "Aucune offre disponible"}
        description={
          hasActiveFilters
            ? "Aucune offre ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
            : "Il n'y a actuellement aucune offre de stage disponible. Revenez plus tard pour découvrir de nouvelles opportunités."
        }
        action={
          hasActiveFilters
            ? { label: "Réinitialiser les filtres", onClick: resetFilters }
            : undefined
        }
      />
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {offers.map((offer, index) => (
        <StudentOffersCard key={offer.id} offer={offer} index={index} />
      ))}
    </div>
  )
} 