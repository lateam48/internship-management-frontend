"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus, User } from "lucide-react"
import Link from "next/link"
import { CompanyOffersCard } from "./CompanyOffersCard"
import type { GetInternshipOfferResponseDTO } from "@/types"
import type { UseMutationResult } from "@tanstack/react-query";

interface CompanyOffersGridProps {
  offers?: GetInternshipOfferResponseDTO[]
  isLoading: boolean
  onStatusChange: (offerId: number, action: string) => void
  activateMutation: UseMutationResult<unknown, unknown, number, unknown>
  inactivateMutation: UseMutationResult<unknown, unknown, number, unknown>
  completeMutation: UseMutationResult<unknown, unknown, number, unknown>
}

export function CompanyOffersGrid({
  offers = [],
  isLoading,
  onStatusChange,
  activateMutation,
  inactivateMutation,
  completeMutation,
}: Readonly<CompanyOffersGridProps>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">{"Vous n'avez encore publié aucune offre"}</p>
        <Link href="/dashboard/offers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer votre première offre
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <CompanyOffersCard
            key={offer.id}
            offer={offer}
            onStatusChange={onStatusChange}
            activateMutation={activateMutation}
            inactivateMutation={inactivateMutation}
            completeMutation={completeMutation}
            onRequestComplete={() => onStatusChange(offer.id, "complete")}
          />
        ))}
      </div>
    </>
  )
}