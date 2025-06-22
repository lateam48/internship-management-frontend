"use client"
import { useParams } from "next/navigation"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { useApplication } from "@/hooks/useApplication"
import { useUserStore, UserStore } from "@/stores/userStore"
import {
  StudentOfferDetailsHeader,
  StudentOfferDetailsCard,
  StudentOfferDetailsApplyCard,
  StudentOfferDetailsCompanyCard,
  StudentOfferDetailsLoading,
  StudentOfferDetailsError,
} from "@/components/modules/student/offer-details"
import type { UserRole } from "@/types"

export function StudentOfferDetails() {
  const params = useParams()
  const offerId = Number(params.id)
  const user = useUserStore((state: UserStore) => state.user)
  const { getInternshipOffer } = useInternshipOffer({ internshipOfferId: offerId })
  const { data: offer, isLoading, error } = getInternshipOffer
  const { getStudentApplications, createApplication } = useApplication({ studentId: user?.id })
  const { data: userApplications } = getStudentApplications
  const createApplicationMutation = createApplication
  const hasApplied = !!userApplications?.some((app) => app.offerId === offerId)

  if (isLoading) return <StudentOfferDetailsLoading />
  if (error || !offer) return <StudentOfferDetailsError />

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <StudentOfferDetailsHeader offer={offer} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentOfferDetailsCard offer={offer} />
        </div>
        <div className="space-y-6">
          <StudentOfferDetailsApplyCard
            offer={offer}
            hasApplied={hasApplied}
            createApplicationMutation={createApplicationMutation}
            user={
              user
                ? { username: "", ...user, role: user.role as UserRole }
                : undefined
            }
          />
          <StudentOfferDetailsCompanyCard offer={offer} />
        </div>
      </div>
    </div>
  )
} 