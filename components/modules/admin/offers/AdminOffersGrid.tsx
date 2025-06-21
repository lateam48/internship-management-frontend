"use client"

import Link from "next/link"
import { MapPin, Clock, Building, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GetInternshipOfferResponseDTO, OfferStatus } from "@/types"

interface AdminOffersGridProps {
  offers: GetInternshipOfferResponseDTO[] | undefined
  isLoading: boolean
}

export function AdminOffersGrid({ offers, isLoading }: AdminOffersGridProps) {
  const getStatusColor = (status: OfferStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusText = (status: OfferStatus) => {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (offers?.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aucune offre trouvée avec ces critères</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers?.map((offer) => (
        <Card key={offer.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{offer.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {offer.companyName}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(offer.status as OfferStatus)}>
                {getStatusText(offer.status as OfferStatus)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {offer.description}
              </p>

              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {offer.location}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {offer.length * 4} semaines
              </div>

              <div className="flex items-center">
                <Badge variant="secondary">{offer.sector.name}</Badge>
              </div>

              {offer.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {offer.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {offer.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{offer.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="pt-2">
                <Link href={`/admin/offers/${offer.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les détails
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 