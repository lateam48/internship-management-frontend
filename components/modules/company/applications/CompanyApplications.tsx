"use client"

import { useState } from "react"
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

  // Filter state
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  // Filter applications
  const filteredApplications = (applications ?? []).filter(app => {
    const matchesStatus = status === "all" || app.status === status.toUpperCase()
    const matchesSearch =
      search === "" ||
      app.firstName.toLowerCase().includes(search.toLowerCase()) ||
      app.lastName.toLowerCase().includes(search.toLowerCase()) ||
      app.offerTitle.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (!userId) {
    return null
  }

  return (
    <div className="space-y-6">
      <CompanyApplicationsHeader />
      <CompanyApplicationsStats applications={filteredApplications} />
      <CompanyApplicationsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />
      <CompanyApplicationsGrid 
        applications={filteredApplications} 
        conventions={conventions}
        isLoading={isLoading}
      />
    </div>
  )
} 