"use client"
import { Card, CardContent } from "@/components/ui/card"

export function StudentOfferDetailsError() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-destructive">Erreur lors du chargement de l&apos;offre</p>
        </CardContent>
      </Card>
    </div>
  )
} 