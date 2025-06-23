"use client"

import { useParams } from "next/navigation"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { useApplication } from "@/hooks/useApplication"
import { CompanyOfferDetailsHeader } from "./CompanyOfferDetailsHeader"
import { CompanyOfferDetailsCard } from "./CompanyOfferDetailsCard"
import { CompanyOfferDetailsApplications } from "./CompanyOfferDetailsApplications"

export function CompanyOfferDetails() {
  const params = useParams()
  const offerId = Number.parseInt(params.id as string)

  const { getInternshipOffer } = useInternshipOffer({ internshipOfferId: offerId })
  const { data: offer, isLoading: offerLoading } = getInternshipOffer

  const { getOfferApplications, updateApplicationStatus, downloadApplicationBundle } = useApplication({ offerId })
  const { data: applications, isLoading: applicationsLoading } = getOfferApplications
  const updateStatusMutation = updateApplicationStatus

  return (
    <div className="space-y-6">
      <CompanyOfferDetailsHeader offer={offer} loading={offerLoading} />
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
