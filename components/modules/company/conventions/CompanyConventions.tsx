"use client"

import { useState } from "react"
import { useUserStore, UserStore } from "@/stores/userStore"
import { useCompanyConventions, useUpdateConventionByCompany, useUploadSignedPdf, useDownloadConventionPdf } from "@/hooks/useConvention"
import { CompanyConventionsHeader } from "./CompanyConventionsHeader"
import { CompanyConventionsStats } from "./CompanyConventionsStats"
import { CompanyConventionsGrid } from "./CompanyConventionsGrid"
import { CompanyConventionsDialogs } from "./CompanyConventionsDialogs"
import { CompanyConventionsFilters } from "./CompanyConventionsFilters"
import type { ConventionResponseDTO } from "@/types"

export function CompanyConventions() {
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { data: conventions = [], isLoading } = useCompanyConventions(userId ?? 0)
  const updateConventionMutation = useUpdateConventionByCompany()
  const uploadPdfMutation = useUploadSignedPdf()
  const downloadPdfMutation = useDownloadConventionPdf()

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  const [editingConvention, setEditingConvention] = useState<ConventionResponseDTO | null>(null)
  const [uploadingConvention, setUploadingConvention] = useState<ConventionResponseDTO | null>(null)

  const filteredConventions = conventions.filter(convention => {
    const matchesStatus = status === "all" || convention.status === status.toUpperCase()
    const searchTerm = search.toLowerCase().trim()
    const matchesSearch =
      search === "" ||
      (convention.title || "").toLowerCase().includes(searchTerm) ||
      (convention.studentName || "").toLowerCase().includes(searchTerm) ||
      (convention.companyName || "").toLowerCase().includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const handleEditConvention = (convention: ConventionResponseDTO) => setEditingConvention(convention)
  const handleCloseEdit = () => setEditingConvention(null)
  const handleUploadConvention = (convention: ConventionResponseDTO) => setUploadingConvention(convention)
  const handleCloseUpload = () => setUploadingConvention(null)

  return (
    <div className="space-y-6">
      <CompanyConventionsHeader count={filteredConventions.length} />
      <CompanyConventionsStats conventions={filteredConventions} />
      <CompanyConventionsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />
      <CompanyConventionsGrid
        conventions={filteredConventions}
        isLoading={isLoading}
        onEditConvention={handleEditConvention}
        onUploadConvention={handleUploadConvention}
        onDownloadPdf={downloadPdfMutation}
        uploadPdfMutation={uploadPdfMutation}
      />
      <CompanyConventionsDialogs
        editingConvention={editingConvention}
        onCloseEdit={handleCloseEdit}
        updateConventionMutation={updateConventionMutation}
        uploadingConvention={uploadingConvention}
        onCloseUpload={handleCloseUpload}
        uploadPdfMutation={uploadPdfMutation}
      />
    </div>
  )
}