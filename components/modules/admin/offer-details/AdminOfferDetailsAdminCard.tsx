"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GetInternshipOfferResponseDTO } from "@/types"

interface AdminOfferDetailsAdminCardProps {
  offer: GetInternshipOfferResponseDTO
}

export function AdminOfferDetailsAdminCard({ offer }: AdminOfferDetailsAdminCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails administratifs</CardTitle>
        <CardDescription>Informations complémentaires pour l&apos;administration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">ID de l&apos;offre</h3>
          <p className="text-sm">{offer.id}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Entreprise</h3>
          <p className="text-sm">{offer.companyName} (ID: {offer.companyId})</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date de création</h3>
          <p className="text-sm">{offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'Non disponible'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Dernière mise à jour</h3>
          <p className="text-sm">{offer.updatedAt ? new Date(offer.updatedAt).toLocaleDateString() : 'Non disponible'}</p>
        </div>
      </CardContent>
    </Card>
  )
} 