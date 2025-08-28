"use client"

import { OfferForm } from "../shared/OfferForm"
import { CreateInternshipOfferRequestDTO, GetInternshipOfferResponseDTO } from "@/types"
import { Sector } from "@/types/sector"

interface EditOfferFormProps {
  offer?: GetInternshipOfferResponseDTO
  getSectors: { data?: Sector[]; isLoading: boolean; }
  updateOffer: {
    mutate: (params: { id: number; data: CreateInternshipOfferRequestDTO }) => void
    isPending: boolean
  }
  user: { id: number } | null
  loading?: boolean
  onCancel: () => void
}

export function EditOfferForm({
  offer,
  getSectors,
  updateOffer,
  user,
  loading = false,
  onCancel,
}: EditOfferFormProps) {
  const handleSubmit = (data: CreateInternshipOfferRequestDTO) => {
    if (!offer?.id) return
    updateOffer.mutate({ id: offer.id, data })
  }

  return (
    <OfferForm
      offer={offer}
      getSectors={getSectors}
      onSubmit={handleSubmit}
      isPending={updateOffer.isPending}
      user={user}
      loading={loading}
      onCancel={onCancel}
      submitButtonText="Mettre à jour l'offre"
    />
  )
}