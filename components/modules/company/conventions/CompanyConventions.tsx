"use client"

import { useState } from "react"
import { useUserStore, UserStore } from "@/stores/userStore"
import { useCompanyConventions, useUpdateConventionByCompany, useUploadSignedPdf, useDownloadConventionPdf } from "@/hooks/useConvention"
import { CompanyConventionsHeader } from "./CompanyConventionsHeader"
import { CompanyConventionsStats } from "./CompanyConventionsStats"
import { CompanyConventionsGrid } from "./CompanyConventionsGrid"
import { CompanyConventionsDialogs } from "./CompanyConventionsDialogs"
import type { ConventionResponseDTO } from "@/types"

export function CompanyConventions() {
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { data: conventions = [], isLoading } = useCompanyConventions(userId ?? 0)
  const updateConventionMutation = useUpdateConventionByCompany()
  const uploadPdfMutation = useUploadSignedPdf()
  const downloadPdfMutation = useDownloadConventionPdf()

  // Dialog/edit state
  const [editingConvention, setEditingConvention] = useState<ConventionResponseDTO | null>(null)
  const [uploadingConvention, setUploadingConvention] = useState<ConventionResponseDTO | null>(null)

  // Handlers
  const handleEditConvention = (convention: ConventionResponseDTO) => setEditingConvention(convention)
  const handleCloseEdit = () => setEditingConvention(null)
  const handleUploadConvention = (convention: ConventionResponseDTO) => setUploadingConvention(convention)
  const handleCloseUpload = () => setUploadingConvention(null)

  return (
    <div className="space-y-6">
      <CompanyConventionsHeader count={conventions.length} />
      <CompanyConventionsStats conventions={conventions} />
      <CompanyConventionsGrid
        conventions={conventions}
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