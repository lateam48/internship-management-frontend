"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetInternshipOfferResponseDTO } from "@/types";

interface CompanyOfferDetailsHeaderProps {
  offer?: GetInternshipOfferResponseDTO
  loading: boolean
  isEditing?: boolean
  onEdit?: () => void
  onCancelEdit?: () => void
}

export function CompanyOfferDetailsHeader({ 
  offer, 
  loading, 
  isEditing = false, 
  onEdit, 
}: CompanyOfferDetailsHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "INACTIVE":
        return "bg-gray-100 text-gray-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active"
      case "INACTIVE":
        return "Inactive"
      case "COMPLETED":
        return "Terminée"
      default:
        return status
    }
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <Link href="/dashboard/offers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux offres
        </Button>
      </Link>
      <div className="flex items-center gap-3">
        {loading ? (
          <Skeleton className="h-8 w-32 rounded" />
        ) : offer ? (
          <>
            <Badge className={getStatusColor(offer.status)}>
              {getStatusText(offer.status)}
            </Badge>
            {!isEditing && offer.status !== "COMPLETED" && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
} 