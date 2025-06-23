"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Eye, Play, Pause, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { GetInternshipOfferResponseDTO } from "@/types"
import type { UseMutationResult } from "@tanstack/react-query";

interface CompanyOffersCardProps {
  offer: GetInternshipOfferResponseDTO
  onStatusChange: (offerId: number, action: string) => void
  activateMutation: UseMutationResult<unknown, unknown, number, unknown>
  inactivateMutation: UseMutationResult<unknown, unknown, number, unknown>
  completeMutation: UseMutationResult<unknown, unknown, number, unknown>
  onRequestComplete: () => void
}

export function CompanyOffersCard({
  offer,
  onStatusChange,
  activateMutation,
  inactivateMutation,
  completeMutation,
  onRequestComplete
}: Readonly<CompanyOffersCardProps>) {
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{offer.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {offer.location}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(offer.status)}>{getStatusText(offer.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {offer.length * 4} semaines
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            Secteur: {offer.sector.name}
          </div>

          <div className="flex space-x-2 pt-2">
            <Link href={`/dashboard/offers/${offer.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </Button>
            </Link>

            {offer.status === "ACTIVE" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(offer.id, "inactivate")}
                disabled={inactivateMutation.isPending}
              >
                <Pause className="h-4 w-4" />
              </Button>
            ) : offer.status === "INACTIVE" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(offer.id, "activate")}
                disabled={activateMutation.isPending}
              >
                <Play className="h-4 w-4" />
              </Button>
            ) : null}

            {offer.status !== "COMPLETED" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRequestComplete}
                disabled={completeMutation.isPending}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 