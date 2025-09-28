"use client"

import { useParams, useRouter } from "next/navigation"
import { useSectors } from "@/hooks/useSectors"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { EditOfferForm } from "./EditOfferForm"
import { UserStore, useUserStore } from "@/stores/userStore"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CompanyEditOffer() {
  const params = useParams()
  const router = useRouter()
  const user = useUserStore((state: UserStore) => state.user)
  const { getSectors } = useSectors()
  const { getInternshipOffer, updateInternshipOffer } = useInternshipOffer({ internshipOfferId: Number(params.id) })

  const handleCancel = () => {
    router.back()
  }

  if (getInternshipOffer.isLoading || getSectors.isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <div className="space-y-4 py-8">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-96 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (getInternshipOffer.isError || !getInternshipOffer.data || getSectors.isError || !getSectors.data) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Erreur lors du chargement des données</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{"Modifier l'offre"}</h1>
        <p className="text-muted-foreground">Modifiez les détails de votre offre de stage</p>
      </div>
      <EditOfferForm
        offer={getInternshipOffer.data}
        getSectors={getSectors}
        updateOffer={updateInternshipOffer}
        user={user}
        onCancel={handleCancel}
      />
    </div>
  )
}