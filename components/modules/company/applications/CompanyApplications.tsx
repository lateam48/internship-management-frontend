"use client"

import { useUserStore, UserStore } from "@/stores/userStore"
import { useApplication } from "@/hooks/useApplication"
import { useCompanyConventions } from "@/hooks/useConvention"
import { CompanyApplicationsHeader } from "./CompanyApplicationsHeader"
import { CompanyApplicationsGrid } from "./CompanyApplicationsGrid"
import { CompanyApplicationsStats } from "./CompanyApplicationsStats"
import { CompanyApplicationsFilters } from "./CompanyApplicationsFilters"

export function CompanyApplications() {
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { getCompanyApplications } = useApplication({ companyId: userId })
  const { data: conventions } = useCompanyConventions(userId ?? 0)
  const { data: applications, isLoading } = getCompanyApplications

  if (!userId) {
    return null
  }

  return (
    <div className="space-y-6">
      <CompanyApplicationsHeader />
      <CompanyApplicationsStats applications={applications} />
      <CompanyApplicationsFilters />
      <CompanyApplicationsGrid 
        applications={applications} 
        conventions={conventions}
        isLoading={isLoading}
      />
    </div>
  )
} 