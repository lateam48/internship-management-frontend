"use client"

import {
  useTeacherConventions,
  useValidateConventionByTeacher as useValidateConvention,
  useRejectConventionByTeacher,
  useDownloadConventionPdf,
} from "@/hooks/useConvention"
import { useState, useMemo } from "react"
import { TeacherConventionsHeader } from "./TeacherConventionsHeader"
import { TeacherConventionsStats } from "./TeacherConventionsStats"
import { TeacherConventionsGrid } from "./TeacherConventionsGrid"
import { TeacherConventionsFilters } from "./TeacherConventionsFilters"
import { UserStore, useUserStore } from "@/stores/userStore"

export function TeacherConventions() {
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id  
  const { data: conventions, isLoading, error } = useTeacherConventions(userId ?? 0)

  const [filters, setFilters] = useState<{ status: "ALL" | "PENDING" | "VALIDATED_BY_TEACHER" | "REJECTED_BY_TEACHER" | "APPROVED_BY_ADMIN" | "REJECTED_BY_ADMIN"; search: string }>({ status: "ALL", search: "" })

  const validateMutation = useValidateConvention()
  const rejectMutation = useRejectConventionByTeacher()
  const downloadPdfMutation = useDownloadConventionPdf()

  const [rejectReasons, setRejectReasons] = useState<Record<number, string>>({})
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [validatingId, setValidatingId] = useState<number | null>(null)
  const [downloadingConventions, setDownloadingConventions] = useState<Set<number>>(new Set())

  const handleValidate = async (conventionId: number) => {
    setValidatingId(conventionId)
    try {
      await validateMutation.mutateAsync(conventionId)
    } finally {
      setValidatingId(null)
    }
  }

  const handleReject = async (conventionId: number) => {
    const reason = rejectReasons[conventionId]?.trim()
    if (reason) {
      setRejectingId(conventionId)
      try {
        await rejectMutation.mutateAsync({ id: conventionId, reason })
        setRejectReasons((prev) => {
          const newReasons = { ...prev }
          delete newReasons[conventionId]
          return newReasons
        })
      } finally {
        setRejectingId(null)
      }
    }
  }

  const handleDownloadPdf = async (conventionId: number) => {
    setDownloadingConventions((prev) => new Set(prev).add(conventionId))
    try {
      await downloadPdfMutation.mutateAsync(conventionId)
    } finally {
      setDownloadingConventions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(conventionId)
        return newSet
      })
    }
  }

  const filteredConventions = useMemo(() => {
    if (!conventions) return []
    
    return conventions.filter((convention) => {
      const matchesStatus = filters.status === "ALL" || convention.status === filters.status
      const matchesSearch = !filters.search || 
        convention.studentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        convention.companyName?.toLowerCase().includes(filters.search.toLowerCase())
      
      return matchesStatus && matchesSearch
    })
  }, [conventions, filters])

  const pendingCount = conventions?.filter((c) => c.status === "PENDING").length ?? 0
  const validatedCount = conventions?.filter((c) => c.status === "VALIDATED_BY_TEACHER").length ?? 0
  const approvedCount = conventions?.filter((c) => c.status === "APPROVED_BY_ADMIN").length ?? 0
  const rejectedCount = conventions?.filter((c) => c.status === "REJECTED_BY_TEACHER" || c.status === "REJECTED_BY_ADMIN").length ?? 0
  const totalCount = conventions?.length ?? 0

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <TeacherConventionsHeader />
      <TeacherConventionsStats 
        pendingCount={pendingCount} 
        validatedCount={validatedCount} 
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        totalCount={totalCount}
      />
      <TeacherConventionsFilters onFiltersChange={setFilters} />
      <TeacherConventionsGrid
        conventions={filteredConventions}
        loading={isLoading}
        error={error}
        onValidate={handleValidate}
        onReject={handleReject}
        onDownloadPdf={handleDownloadPdf}
        rejectReasons={rejectReasons}
        setRejectReasons={setRejectReasons}
        rejectingId={rejectingId}
        setRejectingId={setRejectingId}
        validatingId={validatingId}
        downloadingConventions={downloadingConventions}
        rejectMutationPending={rejectMutation.isPending}
        validateMutationPending={validateMutation.isPending}
      />
    </div>
  )
} 