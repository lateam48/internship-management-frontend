"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Building } from "lucide-react"
import type { GetInternshipOfferResponseDTO } from "@/types/offer"

export function StudentOfferDetailsHeader({ offer }: { offer: GetInternshipOfferResponseDTO }) {
  return (
    <div className="mb-6">
      <Link href="/dashboard/offers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux offres
        </Button>
      </Link>
      <CardTitle className="text-2xl text-foreground mt-4">{offer.title}</CardTitle>
      <CardDescription className="flex items-center text-lg text-muted-foreground">
        <Building className="h-5 w-5 mr-2" />
        {offer.companyName}
      </CardDescription>
    </div>
  )
} 