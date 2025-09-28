"use client"

import { OfferForm } from "../shared/OfferForm"
import { CreateInternshipOfferRequestDTO } from "@/types"
import { Sector } from "@/types/sector"
import { useRouter } from "next/navigation"

interface CreateOfferFormProps {
  getSectors: { data?: Sector[]; isLoading: boolean; }
  createOffer: {
    mutate: (params: { data: CreateInternshipOfferRequestDTO }) => void
    isPending: boolean
  }
  user: { id: number } | null
  loading?: boolean
}

export function CreateOfferForm({
  getSectors,
  createOffer,
  user,
  loading = false,
}: CreateOfferFormProps) {
  const router = useRouter()

  const handleSubmit = (data: CreateInternshipOfferRequestDTO) => {
    createOffer.mutate({ data })
  }

  const handleCancel = () => {
    router.push("/dashboard/offers")
  }

  return (
    <OfferForm
      getSectors={getSectors}
      onSubmit={handleSubmit}
      isPending={createOffer.isPending}
      user={user}
      loading={loading}
      onCancel={handleCancel}
      submitButtonText="Publier l'offre"
    />
  )
} 