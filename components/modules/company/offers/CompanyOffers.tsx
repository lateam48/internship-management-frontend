"use client"

import { useState, useMemo } from "react"
import { useUserStore, UserStore } from "@/stores/userStore"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { useInternshipOffers } from "@/hooks/useInternshipOffers"
import { CompanyOffersHeader } from "./CompanyOffersHeader"
import { CompanyOffersGrid } from "./CompanyOffersGrid"
import { GetInternshipOfferResponseDTO } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function CompanyOffers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [confirmOfferId, setConfirmOfferId] = useState<number | null>(null)
  
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { getInternshipOffers } = useInternshipOffers({ companyId: userId })
  const { data: offers, isLoading } = getInternshipOffers

  const {
    activateInternshipOffer,
    inactivateInternshipOffer,
    completeInternshipOffer
  } = useInternshipOffer({})

  const filteredOffers = useMemo(() => {
    if (!offers) return []
    
    return offers.filter((offer: GetInternshipOfferResponseDTO) => {
      const matchesSearch = searchTerm === "" || 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || offer.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [offers, searchTerm, statusFilter])

  const handleStatusChange = (offerId: number, action: string) => {
    switch (action) {
      case "activate":
        activateInternshipOffer.mutate(offerId)
        break
      case "inactivate":
        inactivateInternshipOffer.mutate(offerId)
        break
      case "complete":
        setConfirmOfferId(offerId)
        break
    }
  }

  return (
    <div className="space-y-6">
      <CompanyOffersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <CompanyOffersGrid
        offers={filteredOffers}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        activateMutation={activateInternshipOffer}
        inactivateMutation={inactivateInternshipOffer}
        completeMutation={completeInternshipOffer}
      />
      <AlertDialog open={confirmOfferId !== null} onOpenChange={(open) => !open && setConfirmOfferId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Marquer l'offre comme terminée ?"}</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Êtes-vous sûr de vouloir marquer cette offre comme terminée ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmOfferId !== null) {
                  completeInternshipOffer.mutate(confirmOfferId)
                  setConfirmOfferId(null)
                }
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}