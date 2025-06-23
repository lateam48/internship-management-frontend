"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetInternshipOfferResponseDTO } from "@/types";

interface CompanyOfferDetailsHeaderProps {
  offer?: GetInternshipOfferResponseDTO
  loading: boolean
}

export function CompanyOfferDetailsHeader({ offer, loading }: CompanyOfferDetailsHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link href="/dashboard/offers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux offres
        </Button>
      </Link>
      {loading ? (
        <Skeleton className="h-8 w-32 rounded" />
      ) : offer ? (
        <Badge className={offer.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {offer.status === "ACTIVE" ? "Active" : "Inactive"}
        </Badge>
      ) : null}
    </div>
  )
} 