"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { useApplication } from "@/hooks/useApplication"
import { useSectors } from "@/hooks/useSectors"
import { useUserStore, UserStore } from "@/stores/userStore"
import { CompanyOfferDetailsHeader } from "./CompanyOfferDetailsHeader"
import { CompanyOfferDetailsCard } from "./CompanyOfferDetailsCard"
import { CompanyOfferDetailsApplications } from "./CompanyOfferDetailsApplications"
import { EditOfferForm } from "../edit-offer"

export function CompanyOfferDetails() {
  const params = useParams()
  const searchParams = useSearchParams()
  const offerId = Number.parseInt(params.id as string)
  const editMode = searchParams.get('edit') === 'true'
  const [isEditing, setIsEditing] = useState(editMode)
  
  const user = useUserStore((state: UserStore) => state.user)
  const { getSectors } = useSectors()
  const { getInternshipOffer, updateInternshipOffer } = useInternshipOffer({ internshipOfferId: offerId })
  const offer = getInternshipOffer.data
  const offerLoading = getInternshipOffer.isLoading

  const { getOfferApplications, updateApplicationStatus, downloadApplicationBundle } = useApplication({ offerId })
  const { data: applications, isLoading: applicationsLoading } = getOfferApplications
  const updateStatusMutation = updateApplicationStatus

  useEffect(() => {
    setIsEditing(editMode)
  }, [editMode])

  const handleEditSuccess = () => {
    setIsEditing(false)
    window.history.replaceState({}, '', `/dashboard/offers/${offerId}`)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    window.history.replaceState({}, '', `/dashboard/offers/${offerId}`)
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <CompanyOfferDetailsHeader 
          offer={offer} 
          loading={offerLoading} 
          isEditing={true}
          onCancelEdit={handleCancelEdit}
        />
        <EditOfferForm
          offer={offer}
          getSectors={getSectors}
          updateOffer={{
            mutate: (params) => {
              updateInternshipOffer.mutate(params, {
                onSuccess: handleEditSuccess
              })
            },
            isPending: updateInternshipOffer.isPending
          }}
          user={user}
          loading={offerLoading}
          onCancel={handleCancelEdit}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CompanyOfferDetailsHeader 
        offer={offer} 
        loading={offerLoading} 
        onEdit={() => setIsEditing(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompanyOfferDetailsCard offer={offer} loading={offerLoading} />
        </div>
        <div>
          <CompanyOfferDetailsApplications
            applications={applications}
            loading={applicationsLoading}
            onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
            updateStatusMutation={updateStatusMutation}
            onDownloadBundle={id => downloadApplicationBundle.mutate(id)}
            downloadBundleMutation={downloadApplicationBundle}
          />
        </div>
      </div>
    </div>
  )
}
