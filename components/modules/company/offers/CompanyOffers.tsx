"use client"

import { useUserStore, UserStore } from "@/stores/userStore"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { useInternshipOffers } from "@/hooks/useInternshipOffers"
import { CompanyOffersHeader } from "./CompanyOffersHeader"
import { CompanyOffersGrid } from "./CompanyOffersGrid"

export function CompanyOffers() {
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { getInternshipOffers } = useInternshipOffers({ companyId: userId })
  const { data: offers, isLoading } = getInternshipOffers

  const {
    activateInternshipOffer,
    inactivateInternshipOffer,
    completeInternshipOffer
  } = useInternshipOffer({})

  const handleStatusChange = (offerId: number, action: string) => {
    switch (action) {
      case "activate":
        activateInternshipOffer.mutate(offerId)
        break
      case "inactivate":
        inactivateInternshipOffer.mutate(offerId)
        break
      case "complete":
        if (confirm("Êtes-vous sûr de vouloir marquer cette offre comme terminée ?")) {
          completeInternshipOffer.mutate(offerId)
        }
        break
    }
  }

  return (
    <div className="space-y-6">
      <CompanyOffersHeader />
      <CompanyOffersGrid
        offers={offers}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        activateMutation={activateInternshipOffer}
        inactivateMutation={inactivateInternshipOffer}
        completeMutation={completeInternshipOffer}
      />
    </div>
  )
} 