"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { GetInternshipOfferResponseDTO } from "@/types"

interface CompanyOfferDetailsCardProps {
  offer?: GetInternshipOfferResponseDTO
  loading: boolean
}

export function CompanyOfferDetailsCard({ offer, loading }: CompanyOfferDetailsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    )
  }
  if (!offer) return null
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{offer.title}</CardTitle>
            <CardDescription className="flex items-center text-lg mt-2">
              <MapPin className="h-5 w-5 mr-2" />
              {offer.location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{offer.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            <span>{offer.length} semaines</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-500" />
            <span>Secteur: {offer.sector.name}</span>
          </div>
        </div>
        {offer.skills && offer.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Compétences requises</h3>
            <div className="flex flex-wrap gap-2">
              {offer.skills.map((skill: string | { name: string }, index: number) => (
                <Badge key={index} variant="outline">
                  {typeof skill === 'string' ? skill : skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 