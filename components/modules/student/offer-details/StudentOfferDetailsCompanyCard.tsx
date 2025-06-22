"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Building, MapPin } from "lucide-react"
import type { GetInternshipOfferResponseDTO } from "@/types/offer"

export function StudentOfferDetailsCompanyCard({ offer }: { offer: GetInternshipOfferResponseDTO }) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Informations sur l&apos;entreprise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium text-foreground">{offer.companyName}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-foreground">{offer.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 