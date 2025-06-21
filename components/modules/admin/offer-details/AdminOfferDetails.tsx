"use client"

import { useParams } from "next/navigation"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { 
  AdminOfferDetailsHeader,
  AdminOfferDetailsCard,
  AdminOfferDetailsAdminCard,
  AdminOfferDetailsLoading,
  AdminOfferDetailsError
} from "@/components/modules/admin/offer-details"

export function AdminOfferDetails() {
  const params = useParams()
  const offerId = Number.parseInt(params.id as string)

  const { 
    getInternshipOffer,
    activateInternshipOffer,
    inactivateInternshipOffer,
    completeInternshipOffer
  } = useInternshipOffer({ internshipOfferId: offerId })
  
  const { data: offer, isLoading: offerLoading, isError: offerError } = getInternshipOffer

  const isMutating = 
    activateInternshipOffer.isPending || 
    inactivateInternshipOffer.isPending || 
    completeInternshipOffer.isPending

  const handleActivate = () => {
    activateInternshipOffer.mutate(offerId)
  }

  const handleInactivate = () => {
    inactivateInternshipOffer.mutate(offerId)
  }

  const handleComplete = () => {
    completeInternshipOffer.mutate(offerId)
  }

  if (offerLoading) {
    return <AdminOfferDetailsLoading />
  }

  if (offerError || !offer) {
    return <AdminOfferDetailsError />
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminOfferDetailsHeader />
      
      <div className="grid grid-cols-1 gap-6">
        <AdminOfferDetailsCard 
          offer={offer}
          isMutating={isMutating}
          onActivate={handleActivate}
          onInactivate={handleInactivate}
          onComplete={handleComplete}
          isActivating={activateInternshipOffer.isPending}
          isInactivating={inactivateInternshipOffer.isPending}
          isCompleting={completeInternshipOffer.isPending}
        />
        
        <AdminOfferDetailsAdminCard offer={offer} />
      </div>
    </div>
  )
}