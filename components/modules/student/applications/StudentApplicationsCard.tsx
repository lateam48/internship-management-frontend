"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Building, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { ApplicationResponseDTO } from "@/types"

function getStatusColor(status: string) {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-100 text-green-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "ACCEPTED":
      return "Acceptée"
    case "REJECTED":
      return "Rejetée"
    case "PENDING":
      return "En attente"
    default:
      return status
  }
}

export function StudentApplicationsCard({
  application,
  onDelete,
  isDeleting,
}: Readonly<{
  application: ApplicationResponseDTO
  onDelete: (id: number) => void
  isDeleting: boolean
}>) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{application.offerTitle}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" />
              Candidature #{application.id}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {getStatusText(application.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Postulé le {format(new Date(application.applicationDate), "dd MMMM yyyy", { locale: fr })}
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/offers/${application.offerId}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Voir l&apos;offre
              </Button>
            </Link>
            {application.status === "PENDING" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(application.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 