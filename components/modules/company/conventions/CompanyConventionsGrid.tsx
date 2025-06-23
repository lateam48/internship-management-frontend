"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { User } from "lucide-react"
import { ConventionResponseDTO } from "@/types/convention"
import { CompanyConventionsCard } from "./CompanyConventionsCard"
import type { DownloadConventionPdfMutation, UploadSignedPdfMutation } from "@/types"

interface CompanyConventionsGridProps {
  conventions: ConventionResponseDTO[]
  isLoading: boolean
  onEditConvention: (convention: ConventionResponseDTO) => void
  onUploadConvention: (convention: ConventionResponseDTO) => void
  onDownloadPdf: DownloadConventionPdfMutation
  uploadPdfMutation: UploadSignedPdfMutation
}

export function CompanyConventionsGrid({
  conventions,
  isLoading,
  onEditConvention,
  onDownloadPdf,
  uploadPdfMutation,
}: Readonly<CompanyConventionsGridProps>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (conventions.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-muted-foreground">Aucune convention pour le moment</p>
          <p className="text-sm text-muted-foreground">
            Les conventions apparaîtront ici après avoir accepté des candidatures
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {conventions.map(convention => (
        <CompanyConventionsCard
          key={convention.id}
          convention={convention}
          onEdit={() => onEditConvention(convention)}
          onDownloadPdf={onDownloadPdf}
          uploadPdfMutation={uploadPdfMutation}
        />
      ))}
    </div>
  )
}