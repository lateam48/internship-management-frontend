"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import type { GetInternshipOfferResponseDTO } from "@/types/offer"

export function StudentOfferDetailsCard({ offer }: { offer: GetInternshipOfferResponseDTO }) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">{offer.title}</CardTitle>
        <CardDescription className="flex items-center text-lg text-muted-foreground">
          {offer.companyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{offer.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-foreground">{offer.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-foreground">{offer.length} mois</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Secteur</h3>
          <Badge variant="secondary" className="text-sm">{offer.sector.name}</Badge>
        </div>
        {offer.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Compétences requises</h3>
            <div className="flex flex-wrap gap-2">
              {offer.skills.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 