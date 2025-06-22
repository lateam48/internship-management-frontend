"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Clock, Building, Star } from "lucide-react"
import type { GetInternshipOfferResponseDTO } from "@/types/offer"

export function StudentOffersCard({ offer, index }: { offer: GetInternshipOfferResponseDTO, index: number }) {
  return (
    <Card
      className="card-hover border-0 shadow-lg bg-card animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{offer.sector.name}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-muted-foreground ml-1">Recommandé</span>
          </div>
        </div>
        <CardTitle className="text-xl text-foreground leading-tight">{offer.title}</CardTitle>
        <CardDescription className="flex items-center text-muted-foreground">
          <Building className="h-4 w-4 mr-1" />
          {offer.companyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{offer.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            {offer.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            {offer.length * 4} semaines
          </div>
        </div>
        {offer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {offer.skills.slice(0, 3).map((skill: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
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
          <Link href={`/student/offers/${offer.id}`}>
            <Button className="w-full gradient-bg text-white btn-animate">Voir les détails</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 