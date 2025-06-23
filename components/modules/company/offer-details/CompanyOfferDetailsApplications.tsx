"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { UseMutationResult } from "@tanstack/react-query"
import { ApplicationResponseDTO } from "@/types"

interface CompanyOfferDetailsApplicationsProps {
  applications?: ApplicationResponseDTO[]
  loading: boolean
  onUpdateStatus: (id: number, status: string) => void
  updateStatusMutation: UseMutationResult<ApplicationResponseDTO, Error, { id: number; status: string }, unknown>
  onDownloadBundle: (id: number) => void
  downloadBundleMutation: UseMutationResult<void, Error, number, unknown>
}

export function CompanyOfferDetailsApplications({
  applications = [],
  loading,
  onUpdateStatus,
  updateStatusMutation,
  onDownloadBundle,
  downloadBundleMutation,
}: CompanyOfferDetailsApplicationsProps) {
  const getStatusColor = (status: string) => {
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
  const getStatusText = (status: string) => {
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidatures ({applications.length})</CardTitle>
        <CardDescription>Gérez les candidatures reçues pour cette offre</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Aucune candidature pour le moment</p>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {application.firstName} {application.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(application.applicationDate), "dd MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusText(application.status)}
                  </Badge>
                </div>
                {application.status === "PENDING" && (
                  <div className="flex-col gap-1">
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(application.id, "ACCEPTED")}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accepter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateStatus(application.id, "REJECTED")}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDownloadBundle(application.id)}
                        disabled={downloadBundleMutation.isPending && downloadBundleMutation.variables === application.id}
                        className="flex-1 w-full"
                      >
                        {downloadBundleMutation.isPending && downloadBundleMutation.variables === application.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-1" />
                        )}
                        Télécharger dossier
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 