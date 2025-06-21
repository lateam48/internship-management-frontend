"use client"

import { useState, useCallback } from "react"
import { useAllConventions, useApproveConventionByAdmin, useRejectConventionByAdmin, useDownloadConventionPdf } from "@/hooks/useConvention"
import { AdminConventionsHeader, AdminConventionsStats, AdminConventionsFilters, AdminConventionsGrid } from "@/components/modules/admin/conventions"

export function AdminConventions() {
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [approvingId, setApprovingId] = useState<number | null>(null)
  const [rejectingId, setRejectingId] = useState<number | null>(null)

  const { data: conventions, isLoading } = useAllConventions()
  const approveMutation = useApproveConventionByAdmin()
  const rejectMutation = useRejectConventionByAdmin()
  const downloadPdfMutation = useDownloadConventionPdf()

  const filteredConventions = conventions?.filter((conv) => {
    return statusFilter === "ALL" || conv.status === statusFilter
  })

  const handleFiltersChange = useCallback((filters: { status: string }) => {
    setStatusFilter(filters.status)
  }, [])

  const handleApprove = (conventionId: number) => {
    setApprovingId(conventionId)
    approveMutation.mutate(conventionId, {
      onSettled: () => setApprovingId(null),
    })
  }

  const handleReject = (conventionId: number, reason: string) => {
    setRejectingId(conventionId)
    rejectMutation.mutate(
      { id: conventionId, reason },
      {
        onSettled: () => setRejectingId(null),
      },
    )
  }

  const handleDownloadPdf = (conventionId: number) => {
    downloadPdfMutation.mutate(conventionId)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminConventionsHeader />
      <AdminConventionsStats conventions={conventions} />
      <AdminConventionsFilters onFiltersChange={handleFiltersChange} />
      <AdminConventionsGrid
        conventions={filteredConventions}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        onDownloadPdf={handleDownloadPdf}
        isApproving={(id) => approvingId === id && approveMutation.isPending}
        isRejecting={(id) => rejectingId === id && rejectMutation.isPending}
        isDownloading={downloadPdfMutation.isPending}
      />
    </div>
  )
}