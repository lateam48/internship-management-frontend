"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StudentApplicationsCard } from "./StudentApplicationsCard"
import type { ApplicationResponseDTO } from "@/types"

export function StudentApplicationsGrid({
  applications,
  isLoading,
  error,
  onDelete,
  isDeleting,
}: Readonly<{
  applications: ApplicationResponseDTO[] | undefined
  isLoading: boolean
  error: unknown
  onDelete: (id: number) => void
  isDeleting: boolean
}>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur lors du chargement des candidatures</p>
      </div>
    )
  }
  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Vous n&apos;avez encore postulé à aucune offre</p>
        <Link href="/student/offers">
          <Button>Découvrir les offres</Button>
        </Link>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application) => (
        <StudentApplicationsCard
          key={application.id}
          application={application}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
} 